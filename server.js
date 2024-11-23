import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './database/connect.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // Hoặc 'dev' cho log đơn giản hơn


// connect database
connectDB()

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
