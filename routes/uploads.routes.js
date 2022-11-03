const { Router } = require('express');
const { check } = require('express-validator');
const {
  uploadFiles,
  updateImage,
  getImage,
  updateImageCloudinary,
} = require('../controllers/uploads.controllers');
const { coleccionesPermitidas } = require('../helpers/dbValidators');
const {
  validationFields,
  validateJWT,
  esAdminRole,
  tieneRole,
} = require('../middlewares/');

const router = Router();

router.post('/', uploadFiles);

router.put(
  '/:coleccion/:id',
  [
    check('id', 'No es un ID de mongo valido').isMongoId(),
    check('coleccion', 'coleccion no permitidad').custom((c) =>
      coleccionesPermitidas(c, ['users', 'products'])
    ),
    validationFields,
  ],
  updateImageCloudinary
);

router.get(
  '/:coleccion/:id',
  [
    check('id', 'No es un mongo id valido').isMongoId(),
    check('coleccion', 'coleccion no permitidad').custom((c) =>
      coleccionesPermitidas(c, ['users', 'products'])
    ),
    validationFields,
  ],
  getImage
);

module.exports = router;
