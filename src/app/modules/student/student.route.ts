import express from 'express';
import { StudentController } from './student.controller';
import handleRequest from '../../../middleware/handleRequest';
import { StudentValidaion } from './student.validation';
const router = express.Router();
router.patch(
  '/:id',
  handleRequest(StudentValidaion.updateStudentZodSchema),
  StudentController.updateStudent
);
// router.get('/:id', StudentController.getSingleStudent);
router.get('/', StudentController.getAllStudents);

// router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;
