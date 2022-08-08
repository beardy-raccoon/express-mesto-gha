const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const JWT_SECRET_KEY = 'super-mega-secret';

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Неверный запрос');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.status(201).send({
      data: {
        _id: newUser._id,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неверный запрос');
      }
      if (err.code === 11000) {
        res.status(409).send({ message: 'Этот email уже занят' });
        return;
      }
      next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updUser) => {
      if (!updUser) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: updUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неверный запрос');
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((updUser) => {
      if (!updUser) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: updUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неверный запрос');
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный email или пароль');
      }
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isLoggedIn]) => {
      if (!isLoggedIn) {
        throw new UnauthorizedError('Неверный email или пароль');
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 403) {
        return res.status(403).send({ message: err.message });
      }
      return next();
    });
};

module.exports = {
  getUsers,
  getUserInfo,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  JWT_SECRET_KEY,
};
