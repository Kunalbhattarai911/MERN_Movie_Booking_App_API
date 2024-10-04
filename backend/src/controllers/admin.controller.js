import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs"

export const updateAdmin = async(req,res) => {
  try {
    const adminId = req.id
    const {email, password } =  req.body;

    let updateAdminData = await Admin.findById(adminId);
    if(!updateAdminData) {
      return res.status(404).json({
        message : "Admin Not Found",
        success : false
      })
    }

    const findEmail = await Admin.findOne({ email });
    if (findEmail) {
      return res.status(400).json({
        message:
          "This Email Is Already Registered. Try With Another Valid Email",
        success: false,
      });
    }

    //update data
    if(email) updateAdminData.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateAdminData.password = hashedPassword;
    }

   await updateAdminData.save();

    const {password: pass, ...rest} = updateAdminData.toObject();

    return res.status(201).json({
      message : "User Updated Successfully",
      success : true,
      ...rest
    })
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An error has occurred while updating the user data",
      error: error.message, 
      success: false,
    });
  }
};


export const deleteAdmin = async (req,res) => {
  try {
    const adminId = req.id;
    const user = await Admin.findByIdAndDelete(adminId);
    if(!user) {
      return res.status(404).json({
        message : "User Not Found",
        success : false
      })
    }

    return  res.status(200).json({
      message : "User Deleated Successfully,",
      success : true
    })

  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An error has occurred while deleting the user",
      error: error.message, 
      success: false,
    });
  }
};
