import Notifications from '../model/Notifications.js';

class NotificationController {
   // Tạo thông báo mới
   async createNotification(req, res) {
      try {
         const { taskId, workspaceId, userId, content, type } = req.body;
         const notification = await Notifications.create({
            taskId,
            workspaceId,
            userId,
            content,
            type
         });
         res.status(201).json(notification);
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   }

   // Lấy thông báo của user
   static async getUserNotifications(req, res) {
      try {
         const { userId } = req.params;
         const notifications = await Notifications.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
         });
         res.status(200).json(notifications);
      } catch (error) {
         logger.error(`Error fetching notifications: ${error.message}`);
         res.status(500).json({ error: error.message });
      }
   }

   // Đánh dấu đã đọc
   static async markAsRead(req, res) {
      try {
         const { notificationId } = req.params;
         await Notifications.update(
            { isRead: true },
            { where: { notificationId } }
         );
         res.status(200).json({ message: "Notification marked as read" });
      } catch (error) {
         logger.error(`Error marking notification as read: ${error.message}`);
         res.status(500).json({ error: error.message });
      }
   }

   // Lấy thông báo chưa đọc
   static async getUnreadNotifications(req, res) {
      try {
         const { userId } = req.params;
         const notifications = await Notifications.findAll({
            where: {
               userId,
               isRead: false
            },
            order: [['createdAt', 'DESC']]
         });
         res.status(200).json(notifications);
      } catch (error) {
         logger.error(`Error fetching unread notifications: ${error.message}`);
         res.status(500).json({ error: error.message });
      }
   }

   // Thêm phương thức tạo thông báo chào mừng
   async createWelcomeNotification(userId) {
      try {
         if (!userId) {
            console.error('User ID is missing');
            return null;
         }

         // Set expiration time to 24 hours from now
         const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

         const notification = await Notifications.create({
            userId: userId,
            content: "Chào mừng bạn đến với PTM! 👋",
            type: 'WELCOME_MESSAGE',
            isRead: false,
            expiresAt: expiresAt
         });

         console.log('Welcome notification created, expires at:', expiresAt);
         return notification;
      } catch (error) {
         console.error('Error creating welcome notification:', error);
         throw error;
      }
   }
}

export default new NotificationController();