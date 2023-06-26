import express from 'express';
import handleRequest from '../../../middleware/handleRequest';
import { ManagementDepartmentValidation } from './managentDepartment.validation';
import { ManagementDepartmentController } from './managementDepartment.controller';
const router = express.Router();

router.post(
  '/create-department',
  handleRequest(
    ManagementDepartmentValidation.createManagementDepartmentZodSchema
  ),
  ManagementDepartmentController.createDepartment
);

router.get('/', ManagementDepartmentController.getAllDepartments);

export const ManagementDepartmentRoutes = router;
