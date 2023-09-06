const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { authorizationRequired, authorizationError } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  if (req.url.includes('/signin') || req.url.includes('/signup')) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(authorizationRequired);
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError(authorizationError));
  }
};

module.exports = authMiddleware;
