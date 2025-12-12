import Joi from 'joi';


export const validateUser = Joi.object({
    fullname : Joi.string().required().trim().min(2),
    email : Joi.string().email().required(),
    password : Joi.string().required().min(6),
    age : Joi.number().required().min(18),
    phoneNumber : Joi.string().required(),
    status : Joi.string().valid('active','inactive'),
    role : Joi.string().valid('admin' , 'cheffeur')
});

export const validateLogin = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required().min(6)
});
// export const validateCamion = Joi.object({

// });
// export const validateCamion = Joi.object({

// });
// export const validateCamion = Joi.object({

// });
// export const validateCamion = Joi.object({

// })







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
