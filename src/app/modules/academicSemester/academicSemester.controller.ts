import { Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsync from '../../../shared/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { academicFacultyFilterableFields } from '../academicFaculty/academicFaculty.constant';
const createSemester = catchAsync(async (req: Request, res: Response) => {
  const { ...academicSemesterData } = req.body;
  const result = await AcademicSemesterService.createSemester(
    academicSemesterData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully!',
    data: result,
    meta: {
      page: 2,
      limit: 1,
      total: 10,
    },
  });
});

const getAllAcademicSemesters = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  async (req: Request, res: Response) => {
    const filters = pick(req.query, academicFacultyFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result = await AcademicSemesterService.getAllAcademicSemesters(
      filters,
      paginationOptions
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester data is retrieved',
      meta: result.meta,
      data: result.data,
    });
  }
);
const updateAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AcademicSemesterService.updateAcademicSemester(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester is Updated',
      data: result,
    });
  }
);
export const AcademicSemesterController = {
  createSemester,
  getAllAcademicSemesters,
  updateAcademicSemester,
};
