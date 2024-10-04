import Admin from "../models/Admin.model.js";
import Movie from "../models/Movie.model.js";

// Add movie by admin
export const addMovies = async (req, res) => {
  try {
    const { 
      title, description, releaseDate, posterUrl, featured, totalSeats, cast, halls, movieDuration 
    } = req.body;
    const adminId = req.id;

    // Initialize availableSeats for each hall
    const hallsWithAvailableSeats = halls.map(hall => ({
      ...hall,
      availableSeats: hall.totalSeats, // Set availableSeats to totalSeats initially
    }));

    // Create the new movie
    const newMovie = await Movie.create({
      adminId,
      title,
      description,
      releaseDate,
      posterUrl,
      featured,
      totalSeats,
      cast,
      halls: hallsWithAvailableSeats,
      movieDuration
    });

    // Update the Admin's addedMovies field
    await Admin.findByIdAndUpdate(adminId, { $push: { addedMovies: newMovie._id } });

    return res.status(201).json({
      message: "Movie added successfully",
      success: true,
      newMovie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while adding the movie",
      error: error.message,
      success: false,
    });
  }
};

// Get movies by admin
export const getMovie = async (req, res) => {
  try {
    const adminId = req.id;

    const movies = await Movie.find({ adminId });

    if (!movies || movies.length === 0) {
      return res.status(404).json({
        message: "Movies not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "List of movies",
      success: true,
      movies,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while retrieving the movies",
      error: error.message,
      success: false,
    });
  }
};

// Get movie by ID for admin
export const getMovieById = async (req, res) => {
  try {
    const adminId = req.id;
    const { id } = req.params;

    const singleMovie = await Movie.findOne({ adminId, _id: id });
    if (!singleMovie) {
      return res.status(404).json({
        message: "Movie Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Movie Information",
      success: true,
      singleMovie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while retrieving the movie",
      error: error.message,
      success: false,
    });
  }
};

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({
      message: "Successfully retrieved all movies",
      success: true,
      movies,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while retrieving the movies",
      error: error.message,
      success: false,
    });
  }
};

// Update movie by admin
export const updateMovie = async (req, res) => {
  try {
    const adminId = req.id;
    const { id } = req.params;
    const {
      title, description, releaseDate, posterUrl, featured, bookings, totalSeats, cast, halls, movieDuration
    } = req.body;

    let findMovie = await Movie.findOne({ adminId, _id: id });
    if (!findMovie) {
      return res.status(404).json({
        message: "Movie Not Found",
        success: false,
      });
    }

    // Update fields
    if (title) findMovie.title = title;
    if (description) findMovie.description = description;
    if (releaseDate) findMovie.releaseDate = releaseDate;
    if (posterUrl) findMovie.posterUrl = posterUrl;
    if (featured !== undefined) findMovie.featured = featured;
    if (bookings) findMovie.bookings = bookings;
    if (totalSeats) findMovie.totalSeats = totalSeats;
    if (cast) findMovie.cast = cast;
    if (halls) findMovie.halls = halls;
    if (movieDuration) findMovie.movieDuration = movieDuration;

    await findMovie.save();

    return res.status(201).json({
      message: "Movie updated successfully",
      success: true,
      findMovie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while updating the movie",
      error: error.message,
      success: false,
    });
  }
};

// Delete movie by admin
export const deleteMovie = async (req, res) => {
  try {
    const adminId = req.id;
    const { id } = req.params;

    const deleteMovie = await Movie.findOneAndDelete({ adminId, _id: id });
    if (!deleteMovie) {
      return res.status(404).json({
        message: "Movie Not Found With This Id",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while deleting the movie",
      error: error.message,
      success: false,
    });
  }
};

// Search for movies
export const searchMovies = async (req, res) => {
  try {
    const { 
      title, description, releaseDate, featured, cast, 
      page = 1, limit = 10, sortBy = 'releaseDate', order = 'asc' 
    } = req.query;

    // Build query object
    let query = {};

    if (title) query.title = { $regex: title, $options: "i" }; // Case-insensitive search for title
    if (description) query.description = { $regex: description, $options: "i" };
    if (releaseDate) query.releaseDate = new Date(releaseDate);
    if (featured !== undefined) query.featured = featured === 'true'; // Boolean conversion
    if (cast) query.cast = { $regex: cast, $options: "i" }; // Case-insensitive search for cast

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Fetch movies with manual pagination and sorting
    const movies = await Movie.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })  // Sorting by specified field
      .skip((pageNumber - 1) * pageSize)  // Skip documents for pagination
      .limit(pageSize);  // Limit the number of documents per page

    // Fetch the total count of documents matching the query for pagination
    const totalDocs = await Movie.countDocuments(query);

    if (!movies.length) {
      return res.status(404).json({
        message: "No movies found matching the search criteria.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Search results for movies",
      success: true,
      movies,
      pagination: {
        totalDocs,
        limit: pageSize,
        totalPages: Math.ceil(totalDocs / pageSize),
        page: pageNumber,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while searching for movies.",
      success: false,
      error: error.message,
    });
  }
};

