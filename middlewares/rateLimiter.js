const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP в интервал времени
  message: 'Слишком много запросов с этого IP, попробуйте позже.',
});

module.exports = limiter;
