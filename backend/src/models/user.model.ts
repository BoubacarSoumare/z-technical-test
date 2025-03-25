import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define and export preference types
export type SortBy = 'title' | 'author' | 'lastModifiedDate';
export type SortOrder = 'asc' | 'desc';

export interface UserPreferences {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  preferences: UserPreferences;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    sortBy: { 
      type: String, 
      enum: ['title', 'author', 'lastModifiedDate'],
      default: 'lastModifiedDate' 
    },
    sortOrder: { 
      type: String, 
      enum: ['asc', 'desc'],
      default: 'desc' 
    }
  }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const UserModel = mongoose.model<IUser>('User', userSchema);