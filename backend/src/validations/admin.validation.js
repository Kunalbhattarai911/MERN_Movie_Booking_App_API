import Joi from "joi";

export const adminRegisterValidation = (req, res, next) => {
  const schema = Joi.object({
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

export const adminLoginValidation = (req,res,next) => {
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
}

export const adminUpdateValidation = (req,res,next) => {
  const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
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
}
