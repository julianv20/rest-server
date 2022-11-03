const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (
  files,
  extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'],
  carpeta = ''
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extension ${extension} no es permitida, -  ${extensionesValidas}`
      );
    }

    const nameTemporal = uuidv4() + '.' + extension;
    const uploadPath = path.join(
      __dirname,
      '../uploads',
      carpeta,
      nameTemporal
    );

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(nameTemporal);
    });
  });
};

module.exports = { uploadFile };
