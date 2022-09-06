import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from 'config';
import { UserDocument } from '../schema/user.schema';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  let user = this as UserDocument;

  try {
    // When password is hashed already, no need to be hashed
    if (!user.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSaltSync(
      config.get('dbConfig.saltWorkFactor') as number
    );
    const hashedPassword = await bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;
  } catch (err: any) {
    return next(err);
  }
});

userSchema.methods.hashPassword = async function (
  candidatePassword: string
): Promise<string> {
  const salt = await bcrypt.genSaltSync(
    config.get('dbConfig.saltWorkFactor') as number
  );
  const hashedPassword = await bcrypt.hashSync(candidatePassword, salt);

  return hashedPassword;
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    const user = this as UserDocument;

    return await bcrypt.compareSync(candidatePassword, user.password);
  } catch (_) {
    return false;
  }
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
