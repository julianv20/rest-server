const esAdminRole = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      message: 'Se quiere verificar el rol sin validar el token primero',
    });
  }
  const { user } = req;

  if (user.rol !== 'ADMIN_ROLE') {
    return res.status(401).json({ message: 'Rol no valido' });
  }
  next();
};

const tieneRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        message: 'Se quiere verificar el rol sin validar el token primero',
      });
    }
    if (!roles.includes(req.user.rol)) {
      return res
        .status(401)
        .json({ message: `El servicio requiere uno de estos roles: ${roles}` });
    }

    next();
  };
};
module.exports = {
  esAdminRole,
  tieneRole,
};
