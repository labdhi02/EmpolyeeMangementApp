import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import leaveRoutes from './routes/leaveRoutes.js';

dotenv.config(); // Make sure this is at the top of the file

// Add this for debugging
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'is set' : 'is not set');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leave', leaveRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
