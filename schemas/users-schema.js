import Joi from "joi";

const usersSchema = Joi.object({
    email: Joi.string().required().messages({
        'any.required': `missing required name field`
    }),
    password: Joi.string().required().messages({
        'any.required': `missing required name field`
    }),
});

const userEmailSchema = Joi.object({
    email: Joi.string().required().messages({
        'any.required': `missing required name field`
    }),
});

export default {
    usersSchema,
    userEmailSchema,
};