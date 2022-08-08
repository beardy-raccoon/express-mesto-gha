const router = require('express').Router();
const { errors } = require('celebrate');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const publicRouter = require('./public');

router.use(publicRouter);
router.use(auth, userRouter);
router.use(auth, cardRouter);
router.use(errors());

module.exports = router;
