const { Router } = require('express');
const { check } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controllers');

const {
  isRoleValidate,
  emailExist,
  idExist,
  categorieExist,
  productExist,
  productExistForname,
} = require('../helpers/dbValidators');

const {
  validationFields,
  validateJWT,
  esAdminRole,
  tieneRole,
} = require('../middlewares/');

const router = Router();

router.get('/', getProducts);

router.get(
  '/:id',
  [
    check('id', 'No es un mongo id valido').isMongoId(),
    check('id').custom(productExist),
    validationFields,
  ],
  getProduct
);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'name is required').not().isEmpty().trim(),
    // check('name').custom(productExistForname),
    check('categorie').isMongoId(),
    check('categorie').custom(categorieExist),
    validationFields,
  ],
  createProduct
);
router.put(
  '/:id',
  [
    validateJWT,
    check('id').isMongoId(),
    check('id').custom(productExist),
    check('categorie').isMongoId(),
    check('categorie').custom(categorieExist),
  ],
  updateProduct
);

router.delete(
  '/:id',
  [
    validateJWT,
    esAdminRole,
    check('id').isMongoId(),
    check('id').custom(productExist),
    validationFields,
  ],
  deleteProduct
);

module.exports = router;
