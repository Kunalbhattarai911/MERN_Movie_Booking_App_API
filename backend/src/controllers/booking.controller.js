import Booking from "../models/Booking.model.js";
import Movie from "../models/Movie.model.js";

export const addBooking = async (req, res) => {
    try {
      const userId = req.id; 
      const { movieID } = req.params; 
      const { date, seatNumber, hallNumber } = req.body; // Include hallNumber
  
      // Check if the movie exists
      const existingMovie = await Movie.findById(movieID);
      if (!existingMovie) {
        return res.status(404).json({
          message: "Movie Not Found",
          success: false,
        });
      }
  
      // Check the hall number
      const hall = existingMovie.halls.find(h => h.hallNumber === hallNumber);
      if (!hall) {
        return res.status(400).json({
          message: `Hall number ${hallNumber} does not exist for this movie.`,
          success: false,
        });
      }
  
      // Check the total seat number
      if (seatNumber > hall.totalSeats || seatNumber <= 0) {
        return res.status(400).json({
          message: `Invalid seat number. Please select a seat number between 1 and ${hall.totalSeats}.`,
          success: false,
        });
      }
  
      // Check if the seat is already booked for this movie, date, and hall
      const existingBooking = await Booking.findOne({
        movie: movieID,
        date: new Date(date),
        seatNumber,
        hallNumber,
      });
  
      if (existingBooking) {
        return res.status(400).json({
          message: `Seat number ${seatNumber} in hall ${hallNumber} is already booked for this movie on the selected date.`,
          success: false,
        });
      }
  
      // Create a new booking
      const newBooking = new Booking({
        movie: movieID,
        userID: userId,
        date: new Date(date),
        seatNumber,
        hallNumber, // Save the hall number
      });
  
      await newBooking.save();
  
      // Update available seats
      hall.availableSeats -= 1; // Decrement available seats
      await existingMovie.save(); // Save updated movie document
  
      // Add the booking ID to the movie's bookings array
      existingMovie.bookings.push(newBooking._id);
      await existingMovie.save();
  
      return res.status(201).json({
        message: "Booking Added Successfully",
        success: true,
        newBooking,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
  
export const getBookingMovies = async (req, res) => {
    try {
      const userId = req.id; 
  
      // Find all bookings for this user
      const bookingMovies = await Booking.find({ userID: userId }).populate('movie'); 
  
      // If no bookings are found, return a 404 response
      if (!bookingMovies || bookingMovies.length === 0) {
        return res.status(404).json({
          message: "No booked movies found for this user.",
          success: false,
        });
      }
  
      // Return the list of booked movies
      return res.status(200).json({
        message: "List of Booked Movies",
        success: true,
        bookingMovies,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "An error occurred while retrieving the booked movies.",
        success: false,
        error: error.message,
      });
    }
  };

  export const getSingleBookedMovie = async (req,res) => {
    try {
        const userId = req.id; 
        const {id} = req.params;
    
        // Find all bookings for this user
        const bookingMovies = await Booking.findOne({ userID: userId, _id: id }).populate('movie'); 
    
        // If no bookings are found, return a 404 response
        if (!bookingMovies || bookingMovies.length === 0) {
          return res.status(404).json({
            message: "No booked movies found for this user.",
            success: false,
          });
        }
    
        // Return the list of booked movies
        return res.status(200).json({
          message: "List of Booked Movies",
          success: true,
          bookingMovies,
        });
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "An error occurred while retrieving the booked movies.",
          success: false,
          error: error.message,
        });
      }
  }

  export const searchBookedMovie = async (req, res) => {
    try {
        const userId = req.id; // userId is required
        const { title, date, seatNumber, page = 1, limit = 10, sortBy = 'date', order = 'asc' } = req.query;
    
        // Build query object
        let query = { userID: userId }; // Ensures only bookings for this user are returned
    
        if (title) {
          const movie = await Movie.findOne({ title: { $regex: title, $options: "i" } });
          if (movie) query.movie = movie._id;
        }
        if (date) query.date = new Date(date);
        if (seatNumber) query.seatNumber = seatNumber;
    
        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
    
        // Fetch bookings with manual pagination and sorting
        const bookings = await Booking.find(query)
          .populate('movie')
          .sort({ [sortBy]: order === 'asc' ? 1 : -1 })  // Sorting by specified field
          .skip((pageNumber - 1) * pageSize)  // Skip documents for pagination
          .limit(pageSize);  // Limit the number of documents per page
    
        // Fetch the total count of documents matching the query for pagination
        const totalDocs = await Booking.countDocuments(query);
    
        if (!bookings.length) {
          return res.status(404).json({
            message: "No bookings found matching the search criteria.",
            success: false,
          });
        }
    
        return res.status(200).json({
          message: "Search results for bookings",
          success: true,
          bookings,
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
          message: "An error occurred while searching for bookings.",
          success: false,
          error: error.message,
        });
      }
  };
  