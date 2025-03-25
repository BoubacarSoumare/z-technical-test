import { UserModel, IUser, UserPreferences } from '../models/user.model';

export class UserService {
  async getUserPreferences(email: string): Promise<IUser> {
    try {
      let user = await UserModel.findOne({ email });
      
      if (!user) {
        user = await UserModel.create({ 
          email,
          name: `User ${email.split('@')[0]}`,
          password: Math.random().toString(36),
          preferences: {
            sortBy: 'lastModifiedDate',
            sortOrder: 'desc'
          }
        });
      }
      
      return user;
    } catch (error) {
      if ((error as any).code === 11000) {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
          return existingUser;
        }
      }
      throw error;
    }
  }

  async updateUserPreferences(email: string, preferences: Partial<UserPreferences>): Promise<IUser> {
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $set: { preferences } },
      { new: true, upsert: false, runValidators: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}

export default new UserService();