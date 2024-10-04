import express from "express";
import { deleteAdmin, updateAdmin } from "../controllers/admin.controller.js";
import { isAdminAuthenticated } from "../middlewares/isAdminAuthenticated.js";
import { adminUpdateValidation } from "../validations/admin.validation.js";
import { logoutAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

//update the user details by id
router.put("/update", adminUpdateValidation, isAdminAuthenticated, updateAdmin);

//delete the user id
router.delete("/delete", isAdminAuthenticated, deleteAdmin);

//logout admin
router.get("/logout", logoutAdmin);

export default router;
