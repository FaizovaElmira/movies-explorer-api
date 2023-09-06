const router = require('express').Router();

const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

const { validateUser } = require('../middlewares/validate');

router.get('/me', getUserInfo);
router.patch('/me', validateUser, updateUserInfo);

module.exports = router;
