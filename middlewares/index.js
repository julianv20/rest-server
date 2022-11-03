const { validationFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const { esAdminRole, tieneRole } = require('../middlewares/validateRoles');

module.exports = {
  validationFields,
  validateJWT,
  esAdminRole,
  tieneRole,
};
