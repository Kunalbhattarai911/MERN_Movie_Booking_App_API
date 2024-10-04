import User from "../models/User.model.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1 });
    
    // Check if the users array is empty
    if (users.length > 0) {
      return res.status(200).json({
        message: "Users data",
        success: true,
        users
      });
    } else {
      return res.status(404).json({
        message: "No Users available",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An error has occurred while retrieving the user data",
      error: error.message, 
      success: false,
    });
  }
};

export const updateUser = async(req,res) => {
  try {
    const userId = req.id
    const {name, email, password } =  req.body;

    let updateUser = await User.findById(userId);
    if(!updateUser) {
      return res.status(404).json({
        message : "User Not Found",
        success : false
      })
    }

    const findEmail = await User.findOne({ email });
    if (findEmail) {
      return res.status(400).json({
        message:
          "This Email Is Already Registered. Try With Another Valid Email",
        success: false,
      });
    }

    //update data
    if(name) updateUser.name = name;
    if(email) updateUser.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateUser.password = hashedPassword;
    }

   await updateUser.save();

    const {password: pass, ...rest} = updateUser.toObject();

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


export const deleteUser = async (req,res) => {
  try {
    const userId = req.id;
    const user = await User.findByIdAndDelete(userId);
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