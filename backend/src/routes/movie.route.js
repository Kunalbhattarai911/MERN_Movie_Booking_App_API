import express from 'express';
import { isAdminAuthenticated } from '../middlewares/isAdminAuthenticated.js';
import { addMovies, deleteMovie, getMovie, getMovieById, searchMovies, updateMovie } from '../controllers/movie.controller.js';
import { movieRegister, movieUpdate } from '../validations/movie.validation.js';

const router = express.Router();

//add movie by admin 
router.post("/", movieRegister,isAdminAuthenticated, addMovies)

//admin can see all the movie that they have created
router.get("/getMovies", isAdminAuthenticated, getMovie)

//admin can see the movie that they have created with the help of id
router.get("/getMovie/:id", isAdminAuthenticated, getMovieById)

//admin can update the movie 
router.put("/update/:id", movieUpdate ,isAdminAuthenticated, updateMovie)

//delete movie by admin
router.delete("/delete/:id", isAdminAuthenticated, deleteMovie)


export default router;