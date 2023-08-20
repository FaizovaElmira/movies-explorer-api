const userRoutes = require('express').Router();

const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

const { validateUser } = require('../middlewares/validate');

userRoutes.get('/me', getUserInfo);
userRoutes.patch('/me', validateUser, updateUserInfo);

module.exports = userRoutes;
