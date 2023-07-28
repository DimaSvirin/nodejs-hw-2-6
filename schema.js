import Joi from "joi";

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': `missing required name field`
  }),
  email: Joi.string().required().messages({
    'any.required': `missing required name field`
  }),
  phone: Joi.number().required().messages({
    'any.required': `missing required name field`
  }),
  favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
})

export default {
  contactAddSchema,
  contactUpdateFavoriteSchema
};