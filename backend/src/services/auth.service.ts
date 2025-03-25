import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.config';
import { UserModel, IUser } from '../models/user.model';

export class AuthService {
  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }

  async createUser(userData: { 
    name: string; 
    email: string; 
    password: string; 
  }): Promise<{ user: IUser; token: string }> {
    const user = new UserModel({
      ...userData,
      preferences: {
        sortBy: 'lastModifiedDate',
        sortOrder: 'desc'
      }
    });

    await user.save();

    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}

export default new AuthService();