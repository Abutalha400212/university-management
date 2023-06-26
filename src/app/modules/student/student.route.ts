import express from 'express';
import { StudentController } from './student.controller';
import handleRequest from '../../../middleware/handleRequest';
import { StudentValidaion } from './student.validation';
const router = express.Router();
router.get('/:id', StudentController.getSingleStudentData);
router.get('/', StudentController.getAllStudents);
router.delete('/:id', StudentController.deleteStudent);
router.patch(
  '/:id',
  handleRequest(StudentValidaion.updateStudentZodSchema),
  StudentController.updateStudent
);
export const StudentRoutes = router;
