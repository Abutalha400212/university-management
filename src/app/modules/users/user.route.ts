import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import handleRequest from '../../../middleware/handleRequest';

const router = express.Router();

router.post(
  '/create-student',
  handleRequest(UserValidation.createUserZodSchema),
  UserController.createStudent
);

export const UserRoute = router;
