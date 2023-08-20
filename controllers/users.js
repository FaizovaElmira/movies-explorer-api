const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователя не существует');
    }

    res.send({
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const userId = req.user._id;

    const updatedUserInfo = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );

    if (!updatedUserInfo) {
      throw new NotFoundError('Пользователя не существует');
    }

    res.send({ data: updatedUserInfo });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
};
