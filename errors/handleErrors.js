const { internalServerError } = require('../utils/constants');

const handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? internalServerError
        : message,
    });
  next();
};

module.exports = handleErrors;
