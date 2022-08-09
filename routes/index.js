const router = require('express').Router();
const { errors } = require('celebrate');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const publicRouter = require('./public');
const NotFoundError = require('../errors/not-found-error');

router.use(publicRouter);
router.use(auth, userRouter);
router.use(auth, cardRouter);
router.use(errors());
router.use(auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;
