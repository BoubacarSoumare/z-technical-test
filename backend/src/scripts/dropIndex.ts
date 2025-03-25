import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';

async function dropUserIdIndex() {
  try {
    await mongoose.connect('mongodb://mongo:27017/library');
    console.log('Connected to MongoDB');

    await UserModel.collection.dropIndex('userId_1');
    console.log('Successfully dropped userId index');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

dropUserIdIndex();