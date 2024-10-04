import Admin from "../models/Admin.model.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//user

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const findEmail = await User.findOne({ email });
    if (findEmail) {
      return res.status(400).json({
        message:
          "This Email Is Already Registered. Try With Another Valid Email",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const { password: pass, ...rest } = user.toObject();

    return res.status(201).json({
      message: "Successfully Created New User",
      success: true,
      ...rest,
    });
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An Error Has Occured While Creating A User",
      success: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check the emaol is presented or not in the database

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "Email Or Password is incorrect",
        success: false,
      });
    }

    //check if the user password is correct or not

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      return res.status(403).json({
        message: "Email Or Password is incorrect",
        success: false,
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    const { password: pass, ...rest } = user.toObject();

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Login Successful",
        success: true,
        token,
        ...rest,
      });
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An Error Has Occured While Login The User",
      error: error.message,
      success: false,
    });
  }
};

export const logoutUser = (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logout Successful",
        success: true,
      });
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An Error Occured During Logout",
      success: false,
      error: error.message,
    });
  }
};


//admin

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminCount = await Admin.countDocuments();
    if (adminCount >= 5) {
      return res.status(400).json({
        message: "Admin limit reached. Only 5 admins are allowed.",
        success: false,
      });
    }

    const findEmail = await Admin.findOne({ email });
    if (findEmail) {
      return res.status(400).json({
        message: "This Email is Already beeing registered.",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();

    const { password: pass, addMovies: add, ...rest } = admin.toObject();

    return res.status(201).json({
      message: "Successfully created Admin",
      success: true,
      ...rest,
    });
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An Error Has Occured While registering The admin",
      error: error.message,
      success: false,
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(403).json({
        message: "Email or Password is incorrect",
        success: false,
      });
    }

    const isPasswordEqual = await bcrypt.compare(password, admin.password);
    if (!isPasswordEqual) {
      return res.status(403).json({
        message: "Email or Password is incorrect",
        success: false,
      });
    }

    const token = jwt.sign(
      { email: admin.email, id: admin._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    const { password: pass, ...rest } = admin.toObject();
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Login Successful",
        success: true,
        token,
        ...rest,
      });
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An Error Occured While Login The Admin",
      success: false,
      error: error.message,
    });
  }
};

export const logoutAdmin = (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logout Successful",
        success: true,
      });
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An Error Occured During Logout",
      success: false,
      error: error.message,
    });
  }
};
