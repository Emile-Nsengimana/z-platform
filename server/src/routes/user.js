import express from 'express';
import userController from '../controllers/UsersController';
import {
  signInSchema,
  signupSchema,
  verifyUserSchema
} from '../middlewares/validations/schema/user';
import validator from '../middlewares/validator';
import { multerUploads } from '../middlewares/multer';
import { cloudinaryConfig } from '../middlewares/cloudinary';

const router = express.Router();

router.use('*', cloudinaryConfig);

router.post('/signup', multerUploads, validator(signupSchema), userController.registerUser);
router.post('/signin', validator(signInSchema), userController.signIn);
router.put('/verify', validator(verifyUserSchema), userController.verifyUser);
 
export default router;
