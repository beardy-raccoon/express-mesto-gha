const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NOT_FOUND_ERR,
  BAD_REQUEST_ERR,
  SERVER_ERR,
  NOT_FOUND_USER_ERR_MESSAGE,
  BAD_REQUEST_ERR_MESSAGE,
  SERVER_ERR_MESSAGE,
} = require('../errors/errors');

const JWT_SECRET_KEY = 'super-mega-secret';

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE }));
};

const getUserInfo = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'user not found or doesn\'t exist yet' });
        return;
      }
      res.send({ data: user });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_USER_ERR_MESSAGE });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
        return;
      }
      res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE });
    });
};

const createUser = (req, res) => {
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
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE, more: err.message });
        return;
      }
      if (err.code === 11000) {
        res.status(409).send({ message: 'email already exist' });
        return;
      }
      res.status(SERVER_ERR).send(err.name);
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updUser) => {
      if (!updUser) {
        res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_USER_ERR_MESSAGE });
        return;
      }
      res.send({ data: updUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
        return;
      }
      res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE });
    });
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((updUser) => {
      if (!updUser) {
        res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_USER_ERR_MESSAGE });
        return;
      }
      res.send({ data: updUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
        return;
      }
      res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'Wrong email or password' });
      }
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isLoggedIn]) => {
      if (!isLoggedIn) {
        const err = new Error('Wrong email or password');
        err.statusCode = 403;
        throw err;
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
      return res.send({ name: err.name, message: err.message });
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
