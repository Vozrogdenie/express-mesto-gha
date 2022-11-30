import { Joi, celebrate } from 'celebrate';
import { regExpUrl } from '../utils/regex.js';

export const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(regExpUrl).required(),
  }),
});

export const validateGetCardById = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }).required(),
});
