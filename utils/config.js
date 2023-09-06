const mongoose = require('mongoose');
require('dotenv').config();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  }
};

module.exports = { connectDB, PORT };
