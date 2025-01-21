import mongoose from 'mongoose';

export const connectToDatabase = async () => {
 return mongoose
  .connect('mongodb://mongo:27017/shortenurldb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
};
