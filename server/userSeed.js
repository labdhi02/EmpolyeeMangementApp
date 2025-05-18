import User from './model/User.js';
import bcrypt from 'bcrypt';
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';

dotenv.config(); // Add this line to load environment variables

const userRegister = async () => {
  try {
    await connectToDatabase();  // Wait for database connection
    
    const existingUser = await User.findOne({ email: 'admin@gmail.com' });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashPassword = await bcrypt.hash('admin', 10);
    const newUser = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashPassword,
      role: 'admin',
    });

    await newUser.save();
    console.log('User registered successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

userRegister();
