import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

const connectDB = async () => {
  const dbURL = config.get('dbConfig.url') as string;
  return mongoose.connect(dbURL).then(() => {
    logger.info('Database connected successfully');
  }).catch((error: any) => {
    logger.error(error.message);
    process.exit(1);
  })
}

export default connectDB;