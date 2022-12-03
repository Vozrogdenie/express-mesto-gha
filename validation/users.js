import { Joi, celebrate } from 'celebrate';
import { regExpUrl, regExpEmail } from '../utils/regex.js';

export const validateGetUserById = celebrate({
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }).required(),
});

export const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regExpUrl),
    email: Joi.string().regex(regExpEmail).required(),
    password: Joi.string().required(),
  }),
});

export const validateEditUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

export const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regExpUrl).required(),
  }),
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().regex(regExpEmail).required(),
    password: Joi.string().required(),
  }),
});
