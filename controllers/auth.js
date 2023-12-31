const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { duplicateEmail, invalidData, wrongCredentials } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError(duplicateEmail);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { _id, name: userName, email: userEmail } = user;
    return res.status(201).send({ _id, name: userName, email: userEmail });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError(invalidData));
    }
    return next(error);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' },
    );

    res.send({ user, token });
  } catch (error) {
    next(new UnauthorizedError(wrongCredentials));
  }
};

module.exports = {
  signUp,
  signIn,
};
