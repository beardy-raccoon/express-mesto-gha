const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../controllers/users');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send({ message: 'Unauthorized!' });
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    res.staus(403).send({ message: 'Forbidden!' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
