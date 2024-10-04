import Joi from "joi";

export const userRegisterValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(40).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      success: false,
      error: error.message,
    });
  }

  next();
};

export const userLoginValidation = (req,res,next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      success: false,
      error: error.message,
    });
  }

  next();
};

export const updateUserValidation = (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(1).max(40),
      email: Joi.string().email(),
      password: Joi.string().min(6),
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Bad Request",
        success: false,
        error: error.message,
      });
    }
  
    next();
  };
