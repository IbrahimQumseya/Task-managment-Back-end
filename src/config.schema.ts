/* eslint-disable prettier/prettier */
import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRECT: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),

  MERCHANT_ID: Joi.string().required(),
  BRAIN_TREE_PUBLIC_KEY: Joi.string().required(),
  BRAIN_TREE_PRIVATE_KEY: Joi.string().required(),
});
