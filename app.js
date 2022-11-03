require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { dbConnection } = require('./database/config');
const fileUpload = require('express-fileupload');

dbConnection();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
  })
);

app.use('/api/user', require('./routes/user.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/search', require('./routes/search.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
