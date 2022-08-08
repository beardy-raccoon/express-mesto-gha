const Cards = require('../models/card');
const {
  NOT_FOUND_ERR,
  BAD_REQUEST_ERR,
  SERVER_ERR,
  NOT_FOUND_CARD_ERR_MESSAGE,
  BAD_REQUEST_ERR_MESSAGE,
  SERVER_ERR_MESSAGE,
} = require('../errors/errors');

const getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Cards.create({ name, link, owner: _id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
        return;
      }
      res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE });
    });
};

const deleteCard = (req, res) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Not found' });
        return;
      }
      if (String(card.owner) === req.user._id) {
        Cards.findByIdAndDelete(req.params.cardId)
          .then(() => {
            res.status(200).send({ message: 'Deleted' })
              .catch((err) => {
                if (err.name === 'CastError') {
                  res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
                }
              });
          });
      } else {
        res.status(403).send({ message: 'Forbidden!' });
      }
    });
};

/* Cards.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_CARD_ERR_MESSAGE });
        return;
      }
      res.send({ message: `Карточка '${card.name}' успешно удалена` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
        return;
      }
      res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE });
    }); */

const addLike = (req, res) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((cardLike) => {
      if (!cardLike) {
        res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_CARD_ERR_MESSAGE });
      }
      res.send({ data: cardLike });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
        return;
      }
      res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE });
    });
};

const deleteLike = (req, res) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: _id } }, { new: true })
    .then((cardDisLike) => {
      if (!cardDisLike) {
        res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_CARD_ERR_MESSAGE });
        return;
      }
      res.send({ data: cardDisLike });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERR).send({ message: BAD_REQUEST_ERR_MESSAGE });
        return;
      }
      res.status(SERVER_ERR).send({ message: SERVER_ERR_MESSAGE });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
