// utils/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI; // Ensure this environment variable is set
    if (!uri) {
      throw new Error('MongoDB URI is undefined');
    }

    // Use the latest connection options as per mongoose documentation
    await mongoose.connect(uri, {
      // No need to specify useNewUrlParser, useUnifiedTopology, etc. anymore
      dbName: process.env.MONGO_DB_NAME, // Optional, if you want to specify a database
      // Other options can be added here as per your use case
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
