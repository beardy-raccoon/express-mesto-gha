const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const Cards = require('../models/card');

const getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Cards.create({ name, link, owner: _id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверный запрос'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Forbidden!');
      }

      return Cards.findByIdAndDelete(req.params.cardId)
        .then(() => {
          res.status(200).send({ message: 'Карточка успешно удалена' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный запрос'));
      } else {
        next(err);
      }
    });
};

const addLike = (req, res, next) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((cardLike) => {
      if (!cardLike) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: cardLike });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный запрос'));
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: _id } }, { new: true })
    .then((cardDisLike) => {
      if (!cardDisLike) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: cardDisLike });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный запрос'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
