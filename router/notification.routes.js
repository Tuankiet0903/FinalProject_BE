import express from 'express';
import NotificationController from '../controller/NotificationController.js';

const router = express.Router();

router.post('/create', NotificationController.createNotification);
router.get('/user/:userId', NotificationController.getUserNotifications);
router.put('/:notificationId/read', NotificationController.markAsRead);
router.get('/unread/:userId', NotificationController.getUnreadNotifications);

export default router;