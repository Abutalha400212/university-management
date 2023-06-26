import express from 'express';
import handleRequest from '../../../middleware/handleRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();
router.get('/:id', FacultyController.getSingleFacultyData);
router.get('/', FacultyController.getAllFaculties);
router.delete('/:id', FacultyController.deleteFaculty);
router.patch(
  '/:id',
  handleRequest(FacultyValidation.updateFacultyZodSchema),
  FacultyController.updateFaculty
);
export const FacultyRoutes = router;
