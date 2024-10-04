import express from 'express';
import {  getAllMovies,  searchMovies } from '../controllers/movie.controller.js';

const router = express.Router();

//user can see the movie 
router.get("/", getAllMovies)

//search movie on home page
router.get("/search", searchMovies)

export default router;