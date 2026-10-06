import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 30,
    minPoolSize: env.NODE_ENV === 'production' ? 2 : 0
  });
  return mongoose.connection;
}
