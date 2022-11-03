const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile } = require('../helpers/subirArchivo');
const { User, Product } = require('../models/index');

const uploadFiles = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ message: 'No files were uploaded.' });
    return;
  }

  try {
    // const name = await uploadFile(req.files, ['txt', 'md'], 'textos');
    const name = await uploadFile(req.files, undefined, 'imgs');
    res.json({
      name: name,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateImage = async (req, res) => {
  const { id, coleccion } = req.params;
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ message: 'No files were uploaded.' });
    return;
  }

  try {
    let model;
    switch (coleccion) {
      case 'users':
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: 'No existe un usuario con este id' + id });
        }
        break;

      case 'products':
        model = await Product.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: 'No existe un producto con este id' + id });
        }
        break;

      default:
        return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    if (model.img) {
      const pathImagen = path.join(
        __dirname,
        '../uploads',
        coleccion,
        model.img
      );
      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }

    const name = await uploadFile(req.files, undefined, coleccion);
    model.img = name;
    await model.save();
    res.json({ model });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getImage = async (req, res) => {
  const { coleccion, id } = req.params;
  try {
    let model;
    switch (coleccion) {
      case 'users':
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: `No exite un usuario con este id: ${id}` });
        }
        break;

      case 'products':
        model = await Product.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: `No exite un producto  con este id: ${id}` });
        }
        break;

      default:
        return res
          .status(500)
          .json({ message: 'Se me olvido validar este apartado' });
    }

    if (model.img) {
      const pathImagen = path.join(
        __dirname,
        '../uploads',
        coleccion,
        model.img
      );
      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
      }
    }
    const pathNoImagen = path.join(__dirname, '../assets', 'no-image.jpg');
    res.sendFile(pathNoImagen);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateImageCloudinary = async (req, res) => {
  const { id, coleccion } = req.params;
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ message: 'No files were uploaded.' });
    return;
  }

  try {
    let model;
    switch (coleccion) {
      case 'users':
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: 'No existe un usuario con este id' + id });
        }
        break;

      case 'products':
        model = await Product.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: 'No existe un producto con este id' + id });
        }
        break;

      default:
        return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (model.img) {
      const nameArr = model.img.split('/');
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split('.');
      await cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    // const name = await uploadFile(req.files, undefined, coleccion);

    model.img = secure_url;
    await model.save();
    res.json(model);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = {
  uploadFiles,
  updateImage,
  getImage,
  updateImageCloudinary,
};
