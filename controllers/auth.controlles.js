const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/googleVerify');
const { UserRefreshClient } = require('google-auth-library');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (!user.state) {
      return res.status(400).json({ msg: 'User not active' });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    const token = await generateJWT(user._id);

    res.json({
      user,
      token,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {
    const { email, img, name } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ':p',
        img,
        rol: 'USER_ROLE',
        google: true,
      };

      user = await new User(data);
      await user.save();
    }
    console.log(user);

    if (!user.state) {
      return res
        .status(401)
        .json({ msg: 'Hable con el administrador, usuario bloqueado ' });
    }

    const token = await generateJWT(user._id);

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ ok: false, msg: 'El token no se puedo verificar ' });
  }
};

module.exports = {
  login,
  googleSignIn,
};
