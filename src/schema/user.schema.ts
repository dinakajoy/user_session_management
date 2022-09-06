import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';

export interface UserDocument extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  hashPassword(candidatePassword: string): Promise<string>;
}
