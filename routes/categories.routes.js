const { Router } = require('express');
const { check } = require('express-validator');
const {
  validationFields,
  validateJWT,
  esAdminRole,
  tieneRole,
} = require('../middlewares/');

const {
  getCategories,
  getCategorie,
  createCategorie,
  updateCategorie,
  deleteCategorie,
} = require('../controllers/categories.controllers');
const { categorieExist } = require('../helpers/dbValidators');

const router = Router();

router.get('/', getCategories);
router.get(
  '/:id',
  [
    check('id', 'No es un mongo id valido').isMongoId(),
    check('id').custom(categorieExist),
    validationFields,
  ],
  getCategorie
);
router.post(
  '/',
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty().trim(),
    validationFields,
  ],
  createCategorie
);
router.put(
  '/:id',
  [
    validateJWT,
    check('name').not().isEmpty().trim(),
    check('id').isMongoId(),
    check('id').custom(categorieExist),
    // check('name', 'Name is required').not().isEmpty,
    validationFields,
  ],
  updateCategorie
);
router.delete(
  '/:id',
  [
    validateJWT,
    esAdminRole,
    check('id').isMongoId(),
    check('id').custom(categorieExist),
    validationFields,
  ],
  deleteCategorie
);

module.exports = router;
