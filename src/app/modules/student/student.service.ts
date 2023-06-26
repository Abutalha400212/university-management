/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import {
  IGenereicResponse,
  IPaginationOptions,
} from '../../../interfaces/common';
import { IStudent, IStudentFilters } from './student.interface';
import { studentSearchableFields } from './student.constant';
import { Student } from './student.model';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import { User } from '../users/user.model';

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOtions: IPaginationOptions
): Promise<IGenereicResponse<IStudent[]>> => {
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
      $or: studentSearchableFields.map(field => ({
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

  const result = await Student.find(whereConditions)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort()
    .skip(skip)
    .limit(limit);
  const total = await Student.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleStudentData = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty');

  return result;
};
const updateStudent = async (id: string, payload: Partial<IStudent>) => {
  const isExist = await Student.findOne({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found !');
  }
  const { name, guardian, localGuardian, ...studentData } = payload;
  const updatedStudentData: Partial<IStudent> = { ...studentData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IStudent>;

      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  if (guardian && Object.keys(guardian).length > 0) {
    Object.keys(guardian).forEach(key => {
      const nameKey = `guardian.${key}` as keyof Partial<IStudent>;
      (updatedStudentData as any)[nameKey] = guardian[key as keyof typeof name];
    });
  }
  if (localGuardian && Object.keys(localGuardian).length > 0) {
    Object.keys(localGuardian).forEach(key => {
      const nameKey = `localGuardian.${key}` as keyof Partial<IStudent>;

      (updatedStudentData as any)[nameKey] =
        localGuardian[key as keyof typeof name];
    });
  }
  const result = await Student.findOneAndUpdate({ id }, updatedStudentData, {
    new: true,
  });
  return result;
};

const deleteStudent = async (id: string) => {
  const isExist = await Student.findOne({ id });
  if (!isExist) {
    throw new ApiError(404, 'Student not found');
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const student = await Student.findOneAndDelete({ id }, { session });
    if (!student) {
      throw new ApiError(404, 'Failed to delete student');
    }

    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();
    return student;
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const StudentService = {
  getAllStudents,
  updateStudent,
  getSingleStudentData,
  deleteStudent,
};
