const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth.controlles');
const { emailExist } = require('../helpers/dbValidators');
const { validationFields } = require('../middlewares/validateFields');

const router = Router();

router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('passwod', 'password is required').isEmpty(),
    validationFields,
  ],

  login
);

router.post(
  '/google',
  [
    check('id_token', 'id_token es necesario ').not().isEmpty(),
    validationFields,
  ],

  googleSignIn
);

module.exports = router;
