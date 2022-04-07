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
  SESSION_SECRET: Joi.string().required(),
  //discord
  DISCORD_clientID: Joi.string().required(),
  DISCORD_clientSecret: Joi.string().required(),
  DISCORD_callbackURL: Joi.string().required(),
  //google
  GOOGLE_clientID: Joi.string().required(),
  GOOGLE_clientSecret: Joi.string().required(),
  ///facebook
  FACEBOOK_clientID: Joi.string().required(),
  FACEBOOK_clientSecret: Joi.string().required(),
  //github
  GITHUB_clientID: Joi.string().required(),
  GITHUB_clientSecret: Joi.string().required(),
});
