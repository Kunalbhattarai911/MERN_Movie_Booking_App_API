import express from 'express';
import { deleteUser, getAllUser, updateUser } from '../controllers/user.controller.js';
import { updateUserValidation } from '../validations/user.validation.js';
import { isUserAuthenticated } from '../middlewares/isUserAuthenticated.js';
import { logoutUser } from '../controllers/auth.controller.js';

const router = express.Router();

//get all the users data 
router.get("/",getAllUser)

//update the user details by id
router.put("/update", isUserAuthenticated ,updateUserValidation, updateUser)

//delete the user id 
router.delete("/delete", isUserAuthenticated ,deleteUser)

//logout user
router.get("/logout", logoutUser)

export default router;