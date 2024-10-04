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
import { getAllMovies } from "./src/controllers/movie.controller.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Is Running On The PORT ${PORT}`);
  dbConnection();
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Test Route
app.get("/test", (req, res) => {
  res.json("Test Success");
});

//Routes
app.use("/api/home", homeRoute)
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute)
app.use("/api/admin/movie", movieRoute)
app.use("/api/booking", bookingRoute)
app.use("/api/user/review", reviewRoute)

app.get("/", (req,res) => {
  res.json(getAllMovies)
})