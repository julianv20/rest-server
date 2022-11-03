const { response } = require('express');
const { User, Categorie, Product } = require('../models');
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = ['users', 'categories', 'products', 'roles'];

const searchUsers = async (termino = '', res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const user = await User.findById(termino);
    return res.status(200).json({ results: user ? [user] : [] });
  }

  const regex = new RegExp(termino, 'i');

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  });

  return res.status(200).json({ results: users });
};

const searcCategories = async (termino, res) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const categorie = await Categorie.findById(termino).populate(
      'user',
      'name'
    );
    return res.status(200).json({ results: categorie ? [categorie] : [] });
  }
  const regex = new RegExp(termino, 'i');
  const categories = await Categorie.find({
    $or: [{ name: regex }],
    $and: [{ state: true }],
  }).populate('user', 'name');

  res.status(200).json({ results: categories });
};

const searchProducts = async (termino, res) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const product = await Product.findById(termino)
      .populate('user', 'name')
      .populate('categorie', 'name');
    return res.status(200).json({ results: product ? [product] : [] });
  }

  const regex = new RegExp(termino, 'i');
  const products = await Product.find({
    $or: [{ name: regex }],
    $and: [{ state: true }],
  })
    .populate('user', 'name')
    .populate('categorie', 'name');
  res.status(200).json({ result: products });
};
const search = async (req, res) => {
  const { coleccion, termino } = req.params;
  try {
    if (!coleccionesPermitidas.includes(coleccion)) {
      return res.status(400).json({
        message: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
      });
    }
    switch (coleccion) {
      case 'users':
        searchUsers(termino, res);
        break;

      case 'categories':
        searcCategories(termino, res);
        break;

      case 'products':
        searchProducts(termino, res);
        break;

      default:
        res.status(500).json({
          message: 'Se me olvido hacer esta busqueda',
        });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = {
  search,
};
