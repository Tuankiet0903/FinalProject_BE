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
import OTPRouter from './router/OTP.routes.js';
import authRouter from './router/auth.routes.js';
import adminRouter from './router/admin.routes.js';
import notificationRouter from './router/notification.routes.js'; // Import notification routes
import session from "express-session";
import MemoryStore from 'memorystore'
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import './cron/notificationCron.js';
import clearAndSeedDatabase from './database/seedDatabase.js';
import syncDatabase from './model/Association.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const session = MemoryStore(session);

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
}))

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('combined')); // Hoặc 'dev' cho log đơn giản hơn
// Cấu hình session để lưu thông tin người dùng
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: false,
//     })
// );

// Middleware Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

connectDB().then(async () => {
    //Chay syncDatabase khi co thay doi db
    await syncDatabase();
  
    // chi chay lan dau khi khong co data
    await clearAndSeedDatabase();   

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Error starting server:", error.message);
});

setInterval(() => {
    console.log("Ping");
}, 1000);

app.use('/api/user', UserTestRouter);
app.use('/auth', authRouter);
app.use('/notifications', notificationRouter); // Thêm route notifications
app.use('/space', SpaceRouter);
app.use('/workspace', WorkspaceRouter);
app.use('/folder', FolderRouter);
app.use('/list', ListRouter);
app.use('/task-column', TaskColumnRouter);
app.use('/task', TaskRouter);
app.use('/api/otp', OTPRouter);
app.use('/api/admin', adminRouter);

// app.listen(PORT, () => {
//     console.log(Server is running on http://localhost:${PORT});
// });