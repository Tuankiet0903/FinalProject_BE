import express from 'express';
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAsUnread, // Import phương thức đánh dấu chưa đọc
  getUnreadNotifications,
  deleteNotification // Import phương thức xóa thông báo
} from '../controller/NotificationController.js';

const router = express.Router();

router.post('/create', createNotification);
router.get('/user/:userId', getUserNotifications); // Endpoint để lấy thông báo của người dùng
router.put('/:notificationId/read', markAsRead);
router.put('/:notificationId/unread', markAsUnread); // Thêm route đánh dấu chưa đọc
router.get('/unread/:userId', getUnreadNotifications);
router.delete('/:notificationId', deleteNotification); // Thêm route xóa thông báo

export default router;