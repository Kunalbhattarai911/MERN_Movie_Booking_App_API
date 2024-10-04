import express from "express";
import { addReview } from "../controllers/review.controller.js"; // Assuming this is where your controller is located
import { isUserAuthenticated } from "../middlewares/isUserAuthenticated.js";


const router = express.Router();


router.post("/movies/:movieId/reviews", isUserAuthenticated, addReview);

export default router;
