import Joi from "joi";

export const movieRegister = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    description: Joi.string().min(1).max(200).required(),
    releaseDate: Joi.date().required(),
    posterUrl: Joi.string().uri().required(), 
    featured: Joi.boolean().optional(), 
    totalSeats: Joi.number().required(),
    cast: Joi.array().items(Joi.string().min(1)).required(), 
    halls: Joi.array().items(
      Joi.object({
        hallNumber: Joi.string().min(1).required(),
        totalSeats: Joi.number().required(),
        availableSeats: Joi.number(),
      })
    ).required(), 
    movieDuration: Joi.string().min(1).required(), 
    reviews: Joi.array().items(
      Joi.object({
        user: Joi.string().optional(), 
        rating: Joi.number().min(0).max(5).optional(), 
        comment: Joi.string().optional(), 
        createdAt: Joi.date().default(Date.now).optional(), 
      })
    ).optional(),
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

export const movieUpdate = (req,res,next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(100),
    description: Joi.string().min(1).max(200),
    releaseDate: Joi.date(),
    posterUrl: Joi.string().uri(), 
    featured: Joi.boolean().optional(), 
    totalSeats: Joi.number(),
    cast: Joi.array().items(Joi.string().min(1)), 
    halls: Joi.array().items(
      Joi.object({
        hallNumber: Joi.string().min(1),
        totalSeats: Joi.number(),
        availableSeats: Joi.number(),
      })
    ), 
    movieDuration: Joi.string().min(1), 
    reviews: Joi.array().items(
      Joi.object({
        user: Joi.string().optional(), 
        rating: Joi.number().min(0).max(5).optional(), 
        comment: Joi.string().optional(), 
        createdAt: Joi.date().default(Date.now).optional(), 
      })
    ).optional(),
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

