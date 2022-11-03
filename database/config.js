const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB Connected');
  } catch (e) {
    console.log(e);
    throw new Error('Error connecting to database');
  }
};

module.exports = { dbConnection };
