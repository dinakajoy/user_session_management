import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
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

  if (!user.isModified('password')) {
    return next();
  }

  // const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const salt = await bcrypt.genSalt(config.get('saltWorkFactor') as number);

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt
    .compare(candidatePassword, user.password)
    .catch((e: any) => false);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
