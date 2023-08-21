const express = require('express');
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const authRoutes = require('./auth');
const authMiddleware = require('../middlewares/auth');
const { validateSignIn, validateSignUp } = require('../middlewares/validate');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();

// Публичные роуты
router.post('/signin', validateSignIn, authRoutes);
router.post('/signup', validateSignUp, authRoutes);

// Роуты, которые требуют авторизации
router.use('/users', authMiddleware, userRoutes);
router.use('/movies', authMiddleware, moviesRoutes);

// Обработка несуществующих маршрутов
router.use('/', (req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

module.exports = router;
