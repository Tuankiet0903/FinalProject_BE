import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './database/connect.js';
import { corsOptions } from './config/cors.js';
import UserTestRouter from './router/user.route.js';
import authRouter from './router/auth.routes.js';
import syncDatabase from './model/Association.js';
import seedDatabase from './database/seeddataBase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('combined')); // Hoặc 'dev' cho log đơn giản hơn

// connect database & sync database
connectDB()
syncDatabase()
seedDatabase()


app.use('/api/user', UserTestRouter);
app.use('/api/auth', authRouter);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
