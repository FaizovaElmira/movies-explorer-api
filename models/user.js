const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Неверный формат электронной почты'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Неправильный адрес электронной почты или пароль');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new UnauthorizedError('Неправильный адрес электронной почты или пароль');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
