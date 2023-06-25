import express from 'express';
import handleRequest from '../../../middleware/handleRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';
import { AcademicSemesterController } from './academicSemester.controller';

const router = express.Router();

router.post(
  '/create-semester',
  handleRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
  AcademicSemesterController.createSemester
);

router.patch(
  '/update-semester/:id',
  handleRequest(AcademicSemesterValidation.UpdateAcademicSemesterZodSchema),
  AcademicSemesterController.updateAcademicSemester
);
router.get('/', AcademicSemesterController.getAllAcademicSemesters);

export const AcademicSemesterRoute = router;
