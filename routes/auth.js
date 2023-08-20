const authRoutes = require('express').Router();
const { validateSignIn, validateSignUp } = require('../middlewares/validate');
const {
  login,
  createUser,
} = require('../controllers/auth');

authRoutes.post('/signin', validateSignIn, login);
authRoutes.post('/signup', validateSignUp, createUser);

module.exports = authRoutes;
