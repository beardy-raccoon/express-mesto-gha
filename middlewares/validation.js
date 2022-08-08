const { celebrate, Joi } = require('celebrate');

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string()
      .required()
      .min(6)
      .max(30)
      .email(),
    password: Joi.string().required().min(4).max(30),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .min(6)
      .max(30)
      .email(),
    password: Joi.string().required().min(4).max(30),
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
    avatar: Joi.string().required().uri(),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
});

module.exports = {
  signupValidation,
  signinValidation,
  updateUserProfileValidation,
  updateUserAvatarValidation,
  createCardValidation,
};
