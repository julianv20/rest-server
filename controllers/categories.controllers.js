const { Categorie } = require('../models');

const getCategories = async (req, res) => {
  const { desde = 0, limite = 5 } = req.query;
  try {
    const [total, categories] = await Promise.all([
      Categorie.countDocuments({ state: true }),
      Categorie.find({ state: true })
        .populate('user', 'name')
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.status(200).json({ total, categories });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getCategorie = async (req, res) => {
  const { id } = req.params;
  try {
    const categorie = await Categorie.findById(id).populate('user', 'name');
    res.status(200).json({ categorie });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const createCategorie = async (req, res) => {
  const name = req.body.name.toUpperCase();
  const categorieDB = await Categorie.findOne({ name });

  try {
    if (categorieDB) {
      return res
        .status(400)
        .json({ message: `La categoria ${categorieDB.name} ya existe` });
    } else {
      const data = {
        name,
        user: req.user._id,
      };

      const categorie = new Categorie(data);
      categorie.save();
      res.status(201).json({ categorie });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateCategorie = async (req, res) => {
  const { id } = req.params;
  const name = req.body.name.toUpperCase();

  try {
    const data = {
      name,
      user: req.user._id,
    };

    const categorieUpdate = await Categorie.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(201).json(categorieUpdate);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const deleteCategorie = async (req, res) => {
  const { id } = req.params;

  try {
    const categorieDelete = await Categorie.findByIdAndUpdate(
      id,
      {
        state: false,
      },
      { new: true }
    );

    res.status(200).json(categorieDelete);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = {
  getCategories,
  getCategorie,
  createCategorie,
  updateCategorie,
  deleteCategorie,
};
