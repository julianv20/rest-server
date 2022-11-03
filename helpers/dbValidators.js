const { Categorie, Product } = require('../models');
const Role = require('../models/role.model');
const User = require('../models/user.model');

const isRoleValidate = async (rol = '') => {
  const existRol = await Role.findOne({ rol });
  if (!existRol) {
    throw new Error(`El rol ${rol} no existe`);
  }
};

const emailExist = async (email = '') => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Error(`El email ${email} ya existe`);
  }
};

const idExist = async (id = '') => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error(`El usuario con id: ${id} no existe`);
  }
};

const categorieExist = async (id = '') => {
  const categorie = await Categorie.findById(id);

  if (!categorie) {
    throw new Error(`La categoria no existe`);
  }
  if (!categorie.state) {
    throw new Error(`La categoria no existe`);
  }
};

const productExist = async (id = '') => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error(`El producto no existe`);
  }
  if (!product.state) {
    throw new Error(`El prodcuto no existe`);
  }
};

const productExistForname = async (name = '') => {
  const nameUp = name.toUpperCase();
  const product = await Product.findOne({ nameUp });
  if (product) {
    throw new Error(`El producto ya existe`);
  }
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  console.log(coleccion, colecciones);
  const incluidas = colecciones.includes(coleccion);
  if (!incluidas) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida -- ${colecciones}`
    );
  }
  return true;
};

module.exports = {
  isRoleValidate,
  emailExist,
  idExist,
  categorieExist,
  productExist,
  productExistForname,
  coleccionesPermitidas,
};
