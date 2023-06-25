import express from 'express';
import { UserRoute } from '../app/modules/users/user.route';
import { AcademicSemesterRoute } from '../app/modules/academicSemester/academicSemester.route';
import { AcademicDepartmentRoutes } from '../app/modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoutes } from '../app/modules/academicFaculty/academicFaculty.route';
import { StudentRoutes } from '../app/modules/student/student.route';

const router = express.Router();
const basicRoutes = [
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/users/',
    route: UserRoute,
  },
  {
    path: '/students/',
    route: StudentRoutes,
  },
];

basicRoutes.map(route => router.use(route.path, route.route));

export default router;
