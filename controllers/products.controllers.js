const { Product, Categorie, User } = require('../models');

const getProducts = async (req, res) => {
  const { desde = 0, limite = 5 } = req.query;
  try {
    const [total, products] = await Promise.all([
      Product.countDocuments({ state: true }),
      Product.find({ state: true })
        .populate('user', 'name')
        .populate('categorie', 'name')
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.status(200).json({ total, products });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate('user', 'name')
      .populate('categorie', 'name');

    res.status(200).json(product);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const createProduct = async (req, res) => {
  const { state, price, categorie, description } = req.body;
  const name = req.body.name.toUpperCase();

  try {
    const product = await Product.findOne({ name });

    if (product) {
      throw new Error('El producto ya existe');
    }

    console.log(req.user);

    const data = {
      name,
      user: req.user._id,
      price,
      categorie,
      description,
    };

    const newProduct = new Product(data);
    newProduct.save();
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { state, ...data } = req.body;
  try {
    data.user = req.user._id;
    if (data.name) {
      data.name = data.name.toUpperCase();
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json({ product });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );
    res.status(200).json({ product });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
