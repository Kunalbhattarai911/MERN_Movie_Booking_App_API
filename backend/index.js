import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route.js";
import userRoute from "./src/routes/user.route.js";
import movieRoute from "./src/routes/movie.route.js";
import bookingRoute from "./src/routes/booking.route.js";
import homeRoute from "./src/routes/home.route.js"
import reviewRoute from "./src/routes/review.route.js"
import adminRoute from "./src/routes/admin.route.js"
import dbConnection from "./src/databaseConnection/connectDB.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  try {
    await dbConnection();
    console.log(`Server Is Running On The PORT ${PORT}`);
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
});

app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ message: "Database is connected!" });
  } catch (error) {
    res.status(500).json({ message: "Database connection failed!", error: error.message });
  }
});



//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Test Route
app.get("/", (req, res) => {
  res.json("Welcome To Movie Booking APP");
});

//Routes
app.use("/api/home", homeRoute)
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute)
app.use("/api/admin/movie", movieRoute)
app.use("/api/booking", bookingRoute)
app.use("/api/user/review", reviewRoute)
