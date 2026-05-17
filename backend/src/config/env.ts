import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/nova-leads',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey_replace_me',
  nodeEnv: process.env.NODE_ENV || 'development',
};
