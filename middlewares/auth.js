const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../controllers/users');
const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError('Выполните вход');
  }
  req.user = payload;
  next();
};

module.exports = auth;
