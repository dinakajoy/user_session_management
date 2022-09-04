import { DocumentDefinition } from 'mongoose';
import UserModel from '../models/user.model';
import { UserDocument } from '../schema/user.schema';

export const createUser = async (data: DocumentDefinition<UserDocument>) => {
  try {
    return await UserModel.create(data);
  } catch (e: any) {
    throw new Error(e);
  }
};

export const findUsers = async () => {
  try {
    return await UserModel.find({});
  } catch (e: any) {
    throw new Error(e);
  }
};

export const findUserById = async (id: string) => {
  try {
    return await UserModel.findById(id);
  } catch (e: any) {
    throw new Error(e);
  }
};
