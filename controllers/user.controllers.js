const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');

const getUsers = async (req, res) => {
  const { limit = 5, desde = 0 } = req.query;

  try {
    const [total, users] = await Promise.all([
      User.countDocuments({ state: true }),
      User.find({ state: true }).skip(Number(desde)).limit(Number(limit)),
    ]);

    res.status(200).json({ total, users });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createUser = async (req, res) => {
  const { google, state, img, ...data } = req.body;

  try {
    const salt = bcryptjs.genSaltSync(10);
    data.password = bcryptjs.hashSync(data.password, salt);
    const user = new User(data);
    user.save();

    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...resto } = req.body;
  try {
    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { uid } = req;
  const usuarioAutenticado = req.user;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );
    res.status(200).json({ user, uid });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
