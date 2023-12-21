import mongoose from 'mongoose';
import { mongoUri } from './keys.js';



const connectDB = async () => {
  try {
    await mongoose.connect(`${mongoUri}`, { family: 4 });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);

    process.exit(1);
  }
};

export default connectDB;

