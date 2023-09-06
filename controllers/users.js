const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { userNotFound, duplicateEmailConflict } = require('../utils/constants');

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(userNotFound);
    }

    const userInfo = {
      email: user.email,
      name: user.name,
    };

    res.status(200).send(userInfo);
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
      throw new NotFoundError(userNotFound);
    }

    res.status(200).send({ data: updatedUserInfo });
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new ConflictError(duplicateEmailConflict));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
};
