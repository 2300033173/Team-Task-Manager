const mongoose = require('mongoose');

const connectDB = async () => {
  const url = process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error('Missing MongoDB connection string. Set MONGO_URI environment variable.');
    return;
  }
  try {
    await mongoose.connect(url);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

module.exports = connectDB;
