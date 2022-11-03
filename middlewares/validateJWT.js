const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const validateJWT = async (req, res, next) => {
  const token = req.header('x-token');
  if (!token) return res.status(401).json({ message: 'Token is required' });

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);
    req.uid = uid;

    const user = await User.findById(uid);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'token no valido -- usuario no existe en BD' });
    }

    if (!user.state) {
      return res
        .status(401)
        .json({ message: 'token no valido -- usuario con estado false' });
    }

    req.user = user;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: 'Token no valido' });
  }
};

module.exports = {
  validateJWT,
};
