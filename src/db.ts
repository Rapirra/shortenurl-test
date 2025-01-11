import mongoose from 'mongoose';

export const connectToDatabase = async () => {
 return mongoose
  .connect('mongodb://localhost:27017/shortenurl-db')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
};
