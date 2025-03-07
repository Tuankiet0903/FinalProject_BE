import Notifications from '../model/Notifications.js';

// Tạo thông báo mới
export const createNotification = async (req, res) => {
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
};

// Lấy thông báo của user
export const getUserNotifications = async (req, res) => {
   try {
      const { userId } = req.params;
      const notifications = await Notifications.findAll({
         where: { userId },
         order: [['createdAt', 'DESC']]
      });
      res.status(200).json(notifications);
   } catch (error) {
      console.error(`Error fetching notifications: ${error.message}`);
      res.status(500).json({ error: error.message });
   }
};

// Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
   try {
      const { notificationId } = req.params;
      await Notifications.update(
         { isRead: true },
         { where: { id: notificationId } }
      );
      res.status(200).json({ message: "Notification marked as read" });
   } catch (error) {
      console.error(`Error marking notification as read: ${error.message}`);
      res.status(500).json({ error: error.message });
   }
};

// Đánh dấu chưa đọc
export const markAsUnread = async (req, res) => {
   try {
      const { notificationId } = req.params;
      await Notifications.update(
         { isRead: false },
         { where: { id: notificationId } }
      );
      res.status(200).json({ message: "Notification marked as unread" });
   } catch (error) {
      console.error(`Error marking notification as unread: ${error.message}`);
      res.status(500).json({ error: error.message });
   }
};

// Lấy thông báo chưa đọc
export const getUnreadNotifications = async (req, res) => {
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
      console.error(`Error fetching unread notifications: ${error.message}`);
      res.status(500).json({ error: error.message });
   }
};

// Thêm phương thức tạo thông báo chào mừng
export const createWelcomeNotification = async (userId) => {
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
};

// Xóa thông báo
export const deleteNotification = async (req, res) => {
   try {
      const { notificationId } = req.params;
      await Notifications.destroy({
         where: { id: notificationId }
      });
      res.status(200).json({ message: "Notification deleted successfully" });
   } catch (error) {
      console.error(`Error deleting notification: ${error.message}`);
      res.status(500).json({ error: error.message });
   }
};