import express from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import handleRequest from '../../../middleware/handleRequest';

const router = express.Router();

router.post(
  '/create-department',
  handleRequest(AcademicDepartmentValidation.createAcademicDepartmentZodSchema),
  AcademicDepartmentController.createDepartment
);

router.get('/:id', AcademicDepartmentController.getSingleDepartment);

router.patch(
  '/:id',
  handleRequest(AcademicDepartmentValidation.updateAcademicDepartmentZodSchema),
  AcademicDepartmentController.updateDepartment
);

router.delete('/:id', AcademicDepartmentController.deleteDepartment);

router.get('/', AcademicDepartmentController.getAllDepartments);

export const AcademicDepartmentRoutes = router;
