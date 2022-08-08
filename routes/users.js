const router = require('express').Router();
const { updateUserProfileValidation, updateUserAvatarValidation } = require('../middlewares/validation');
const {
  getUsers,
  getUserInfo,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserProfileValidation, updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatarValidation, updateUserAvatar);

module.exports = router;
