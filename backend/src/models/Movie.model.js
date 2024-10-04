import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  cast: [
    {
      type: String,
      required: true,
    },
  ],
  halls: [
    {
      hallNumber: {
        type: String,
        required: true,
      },
      totalSeats: {
        type: Number,
        required: true,
      },
      availableSeats: {
        type: Number,
        required: true,
      },
    },
  ],
  bookings: [
    {
      type: String,
    },
  ],
  movieDuration: {
    type: String,
    required: true,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 0,
        max: 5
      },
      comment: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
    },
  ],
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
