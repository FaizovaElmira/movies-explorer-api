// require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const path = require('path');
const { errors } = require('celebrate');
const cors = require('cors');

const handleErrors = require('./errors/handleErrors');
const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes');
const auth = require('./middlewares/auth');
// const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

// Переменные среды
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// Промежуточное ПО
app.use(helmet()); // промежуточное ПО безопасности

// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 минут
//   max: 100, // максимальное количество запросо
// });
// app.use(limiter); // ПО промежуточного слоя для ограничения скорости

app.use(cors({
  origin: ['https://faizova.movies-explorer.nomoreparties.co', 'http://faizova.movies-explorer.nomoreparties.co'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // Промежуточное ПО CORS

// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // ПО промежуточного слоя парсера тела

// Промежуточное ПО для установки заголовка Content-Type для всех ответов JSON
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Пользовательское промежуточное ПО
app.use(auth);
// app.use(requestLogger); // ПО промежуточного слоя регистратора запросов
app.use(routes); // Маршруты

// Обработчики ошибок
app.use((req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

// app.use(errorLogger); // Промежуточное ПО регистратора ошибок
app.use(errors()); // Отмечаем обработчик ошибок
app.use(handleErrors); // Централизованный обработчик ошибок

// Маршрут краш-теста
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Подключаемся к MongoDB и запускаем сервер
(async () => {
  try {
    await mongoose.connect(DB_URL, { useNewUrlParser: true });
    console.log('Подключен к MongoDB');
    app.listen(PORT, () => {
      console.log(`Сервер работает на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
  }
})();
