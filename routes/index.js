const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NOT_FOUND_ERR, NOT_FOUND_ERR_MESSAGE } = require('../errors/errors');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_ERR_MESSAGE });
});

module.exports = router;
