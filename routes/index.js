const router = require('express').Router();
const { errors } = require('celebrate');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const publicRouter = require('./public');
const { NOT_FOUND_ERR, NOT_FOUND_URL_ERR_MESSAGE } = require('../errors/errors');

router.use(publicRouter);
router.use(auth, userRouter);
router.use(auth, cardRouter);
router.use(errors());
router.use((req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_URL_ERR_MESSAGE });
});

module.exports = router;
