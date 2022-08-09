const { celebrate, Joi } = require('celebrate');
const { URL_REG_EXP } = require('../utils/consts');

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REG_EXP),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required(),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required(),
  }),
});

const updateUserProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL_REG_EXP),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REG_EXP),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  signupValidation,
  signinValidation,
  updateUserProfileValidation,
  updateUserAvatarValidation,
  createCardValidation,
  userIdValidation,
  cardIdValidation,
};
