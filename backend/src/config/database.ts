import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (uri?: string): Promise<void> => {
  try {
    if (isConnected) {
      console.log('Using existing database connection');
      return;
    }

    const mongoUri = uri || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (!isConnected) {
      return;
    }
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Database disconnection error:', error);
    throw error;
  }
};