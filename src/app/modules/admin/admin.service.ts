/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import {
  IGenereicResponse,
  IPaginationOptions,
} from '../../../interfaces/common';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import { User } from '../users/user.model';
import { IAdmin, IAdminFilters } from './admin.interface';
import { adminSearchableFields } from './admin.constant';
import { Admin } from './admin.model';

const getAllAdmins = async (
  filters: IAdminFilters,
  paginationOtions: IPaginationOptions
): Promise<IGenereicResponse<IAdmin[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.createPagination(paginationOtions);
  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Admin.find(whereConditions)
    .populate('managementDepartment')
    .sort()
    .skip(skip)
    .limit(limit);
  const total = await Admin.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleAdminData = async (id: string) => {
  const result = await Admin.findOne({ id }).populate('managementDepartment');

  return result;
};
const updateAdmin = async (id: string, payload: Partial<IAdmin>) => {
  const isExist = await Admin.findOne({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
  }
  const { name, ...adminData } = payload;
  const updatedAdminData: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;

      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
    new: true,
  });
  return result;
};

const deleteAdmin = async (id: string) => {
  const isExist = await Admin.findOne({ id });
  if (!isExist) {
    throw new ApiError(404, 'Admin not found');
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const admin = await Admin.findOneAndDelete({ id }, { session });
    if (!admin) {
      throw new ApiError(404, 'Failed to delete Admin');
    }
    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();
    return admin;
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const AdminService = {
  getAllAdmins,
  updateAdmin,
  getSingleAdminData,
  deleteAdmin,
};
