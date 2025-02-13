import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './database/connect.js';
import { corsOptions } from './config/cors.js';
import UserTestRouter from './router/user.routes.js';
import SpaceRouter from './router/space.routes.js';
import WorkspaceRouter from './router/workspace.routes.js';
import FolderRouter from './router/folder.routes.js';
import ListRouter from './router/list.routes.js';
import TaskColumnRouter from './router/taskColumn.routes.js';
import TaskRouter from './router/task.routes.js';
import authRouter from './router/auth.routes.js';
import syncDatabase from './model/Association.js';
import seedDatabase from './database/seeddataBase.js';
import session from "express-session";
import passport from "./config/passport.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('combined')); // Hoặc 'dev' cho log đơn giản hơn
// Cấu hình session để lưu thông tin người dùng
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Middleware Passport
app.use(passport.initialize());
app.use(passport.session());

connectDB().then(async () => {
    // await syncDatabase();
    // await seedDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Error starting server:", error.message);
});

app.use('/api/user', UserTestRouter);
app.use('/auth', authRouter);
app.use('/space', SpaceRouter);
app.use('/workspace', WorkspaceRouter);
app.use('/folder', FolderRouter);
app.use('/list', ListRouter);
app.use('/task-column', TaskColumnRouter);
app.use('/task', TaskRouter);

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
