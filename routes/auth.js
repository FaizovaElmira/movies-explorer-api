const express = require('express');
const { signUp, signIn } = require('../controllers/auth');
const { validateSignIn, validateSignUp } = require('../middlewares/validate');

const router = express.Router();

router.post('/signup', validateSignUp, signUp);
router.post('/signin', validateSignIn, signIn);

module.exports = router;
