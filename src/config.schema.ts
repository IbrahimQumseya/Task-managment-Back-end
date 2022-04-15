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
  MAIL_GUN_DOMAIN: Joi.string().required(),
  MAIL_GUN_API: Joi.string().required(),
  RESET_PASSWORD_SECRET: Joi.string().required(),
});
