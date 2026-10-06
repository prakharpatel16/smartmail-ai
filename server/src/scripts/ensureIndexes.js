import mongoose from 'mongoose';
import '../models/index.js';
import { connectDatabase } from '../config/database.js';

await connectDatabase();
try {
  for (const model of Object.values(mongoose.models)) {
    await model.createIndexes();
    console.log(JSON.stringify({ level: 'info', event: 'indexes_ready', collection: model.collection.collectionName }));
  }
} finally {
  await mongoose.disconnect();
}
