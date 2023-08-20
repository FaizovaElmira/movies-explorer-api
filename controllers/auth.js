const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Это электронная почта уже используется');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { _id, name: userName, email: userEmail } = user;
    return res.status(200).send({ _id, name: userName, email: userEmail });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' },
    );

    res.send({ token });
  } catch (error) {
    next(new UnauthorizedError('Неправильные почта или пароль.'));
  }
};

module.exports = {
  createUser,
  login,
};
