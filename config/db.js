import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const DB = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
