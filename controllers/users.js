const User = require('../models/user');
const {
  NOT_FOUND_ERR,
  BAD_REQUEST_ERR,
  SERVER_ERR,
  NOT_FOUND_USER_ERR_MESSAGE,
  BAD_REQUEST_ERR_MESSAGE,
  SERVER_ERR_MESSAGE,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE }));
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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send({ data: newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
        return;
      }
      res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE });
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
