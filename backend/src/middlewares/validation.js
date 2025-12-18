import Joi from 'joi';


export const validateUser = Joi.object({
    fullname : Joi.string().required().trim().min(2),
    email : Joi.string().email().required(),
    password : Joi.string().required().min(6),
    age : Joi.number().required().min(18),
    phoneNumber : Joi.string().required(),
    status : Joi.string().valid('active','inactive'),
    role : Joi.string().valid('admin' , 'driver')
  });

export const validateLogin = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required().min(6)
  });

export const updateStatusSchema = Joi.object({
    status: Joi.string()
      .valid("pending", "in_progress", "completed")
      .required(),
  });
  
export const updateTripDataSchema = Joi.object({
    startKm: Joi.number().min(0),
    endKm: Joi.number().min(Joi.ref("startKm")),
    fuelUsed: Joi.number().min(0),
    fuelCost: Joi.number().min(0),
    notes: Joi.string().allow(""),
    endDate: Joi.date(),
  });




export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                status: 'error',
                message: 'Validation error',
                errors
            });
        }

        next();
    };
};
