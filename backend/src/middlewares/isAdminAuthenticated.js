import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

export const isAdminAuthenticated = async (req, res, next) => {
  let token = req.header("Authorization")?.split(" ")[1] || req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.id;
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({
        message: "Unauthorized admin",
        success: false,
      });
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.log("Error during token verification:", error.message); 
    return res.status(403).json({
      message: "Invalid token",
      success: false,
    });
  }
};
