import Movie from "../models/Movie.model.js";

// Add review to a movie
export const addReview = async (req, res) => {
  try {
    const userId = req.id; // Extract user ID from the request (from authentication middleware)
    const { movieId } = req.params; // Movie ID from URL params
    const { rating, comment } = req.body; // Rating and comment from the request body

    // Validate rating
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 0 and 5.",
        success: false,
      });
    }

    // Find the movie to which the review will be added
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found.",
        success: false,
      });
    }

    // Create the review object
    const newReview = {
      user: userId,
      rating,
      comment,
      createdAt: new Date(),
    };

    // Add the review to the movie's reviews array
    movie.reviews.push(newReview);
    await movie.save(); // Save the updated movie with the new review

    return res.status(201).json({
      message: "Review added successfully.",
      success: true,
      review: newReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while adding the review.",
      success: false,
      error: error.message,
    });
  }
};
