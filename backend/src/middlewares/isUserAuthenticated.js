import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const isUserAuthenticated = async (req, res, next) => {
    let token = req.header("Authorization")?.split(" ")[1] || req.cookies?.token;
  
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access token is missing or invalid", success: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.id = decoded.id;
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(403).json({
          message: "Unauthorized user",
          success: false,
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Invalid token",
        success: false,
      });
    }
  };