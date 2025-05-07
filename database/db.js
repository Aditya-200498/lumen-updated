const mongoose = require('mongoose');
const config = require('../config/config');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

async function connectDB() {
  try {
    await mongoose.connect(dbConfig.mongoUri);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
}

connectDB();

module.exports = mongoose.connection;