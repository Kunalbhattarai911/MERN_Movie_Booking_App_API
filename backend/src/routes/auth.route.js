import express from 'express';
import { adminLogin, loginUser, registerAdmin, registerUser } from '../controllers/auth.controller.js';
import { userLoginValidation, userRegisterValidation } from '../validations/user.validation.js';
import { adminLoginValidation, adminRegisterValidation } from '../validations/admin.validation.js';

const router = express.Router();

//user
router.post("/registerUser", userRegisterValidation,registerUser)
router.post("/loginUser", userLoginValidation ,loginUser)

//admin
router.post("/registerAdmin", adminRegisterValidation ,registerAdmin)
router.post("/loginAdmin", adminLoginValidation,adminLogin )
export default router;