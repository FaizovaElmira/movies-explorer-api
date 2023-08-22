const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimiter = require('./middlewares/rateLimiter');
const handleErrors = require('./errors/handleErrors');
const routes = require('./routes');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { connectDB, PORT } = require('./utils/config');

const app = express();

app.use(cors({
  origin: [
    'https://faizova.movies-explorer.nomoreparties.co',
    'http://faizova.movies-explorer.nomoreparties.co',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(auth);
app.use(requestLogger);
app.use(rateLimiter);
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Маршруты
app.use(routes);

// Обработка ошибок
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

// Подключиться к базе данных и запустить сервер
connectDB();
app.listen(PORT, () => {
  console.log(`Приложение прослушивает порт ${PORT}`);
});
