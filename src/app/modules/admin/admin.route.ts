import express from 'express';
import { AdminController } from './admin.controller';
import handleRequest from '../../../middleware/handleRequest';
import { AdminValidation } from './admin.validation';

const router = express.Router();
router.get('/:id', AdminController.getSingleAdminData);
router.get('/', AdminController.getAllAdmins);
router.delete('/:id', AdminController.deleteAdmin);
router.patch(
  '/:id',
  handleRequest(AdminValidation.updateAdminZodSchema),
  AdminController.updateAdmin
);
export const AdminRoutes = router;
