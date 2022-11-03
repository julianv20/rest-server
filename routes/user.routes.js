const { Router } = require('express');
const { check } = require('express-validator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controllers');

const {
  isRoleValidate,
  emailExist,
  idExist,
} = require('../helpers/dbValidators');

const {
  validationFields,
  validateJWT,
  esAdminRole,
  tieneRole,
} = require('../middlewares/');

const router = Router();

router.get('/', getUsers);

router.get(
  '/:id',
  [check('id').isMongoId, check('id').custom(idExist), validationFields],
  getUser
);

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('email', 'Email is required').isEmail().trim(),
    check('email').custom(emailExist),
    check('password', 'El password debe de tener mas de 6 letras')
      .not()
      .isEmpty()
      .trim()
      .isLength({ min: 6 }),
    // check('rol', 'Rol is required').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(isRoleValidate),
    validationFields,
  ],
  createUser
);

router.put(
  '/:id',
  [
    check('id', 'Id is required').isMongoId(),
    check('id').custom(idExist),
    check('rol').custom(isRoleValidate),
    validationFields,
  ],
  updateUser
);

router.delete(
  '/:id',
  [
    validateJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'Id is required').isMongoId(),
    check('id').custom(idExist),
    validationFields,
  ],
  deleteUser
);

module.exports = router;
