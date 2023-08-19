const { celebrate, Joi } = require('celebrate');

const urlPattern = /https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/;

const validateUpdateUser = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string().required().pattern(urlPattern),
    trailer: Joi.string().required().pattern(urlPattern),
    thumbnail: Joi.string().required().pattern(urlPattern),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateUpdateUser,
  validateCreateUser,
  validateLogin,
  validateCreateMovie,
  validateDeleteMovie,
};
