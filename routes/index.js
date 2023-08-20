const express = require('express');
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const authRoutes = require('./auth');

const routes = express.Router();

// Публичные роуты
routes.use('/auth', authRoutes);

// Роуты, которые требуют авторизации
routes.use('/users', userRoutes);
routes.use('/movies', moviesRoutes);

module.exports = routes;
