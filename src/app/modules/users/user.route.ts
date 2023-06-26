import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import handleRequest from '../../../middleware/handleRequest';

const router = express.Router();

router.post(
  '/create-student',
  handleRequest(UserValidation.createStudentZodSchema),
  UserController.createStudent
);
router.post(
  '/create-faculty',
  handleRequest(UserValidation.createFacultyZodSchema),
  UserController.createFaculty
);
router.post(
  '/create-admin',
  handleRequest(UserValidation.createAdminZodSchema),
  UserController.createAdmin
);

export const UserRoute = router;
