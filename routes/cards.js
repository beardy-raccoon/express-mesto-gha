const router = require('express').Router();
const { createCardValidation, cardIdValidation } = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCardValidation, createCard);
router.delete('/cards/:cardId', cardIdValidation, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidation, addLike);
router.delete('/cards/:cardId/likes', cardIdValidation, deleteLike);

module.exports = router;
