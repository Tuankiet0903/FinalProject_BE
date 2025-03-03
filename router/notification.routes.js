import express from 'express';
import {
   createNotification,
   getUserNotifications,
   markAsRead,
   getUnreadNotifications
} from '../controller/NotificationController.js';

const router = express.Router();

router.post('/create', createNotification);
router.get('/user/:userId', getUserNotifications); // Endpoint để lấy thông báo của người dùng
router.put('/:notificationId/read', markAsRead);
router.get('/unread/:userId', getUnreadNotifications);

export default router;