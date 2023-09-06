const rateLimit = require('express-rate-limit');
const { rateLimitErrorMessage } = require('../utils/constants');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP в интервал времени
  message: rateLimitErrorMessage,
});

module.exports = limiter;
