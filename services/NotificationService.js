import Notifications from '../model/Notifications.js';
import User from '../model/User.js';
import logger from '../utils/logger.js';

class NotificationService {
   // thông báo khi login
   static async createWelcomeNotification(userId) {
      try {
         if (!userId) {
            logger.error('User ID is missing');
            return null;
         }

         const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

         const notification = await Notifications.create({
            userId,
            content: "Chào mừng bạn đến với PTM! 👋",
            type: 'WELCOME_MESSAGE',
            isRead: false,
            expiresAt
         });

         logger.info('Welcome notification created, expires at:', expiresAt);
         return notification;
      } catch (error) {
         logger.error('Error creating welcome notification:', error);
         throw error;
      }
   }

   // thông báo khi được giao task
   static async createTaskAssignmentNotification({ taskId, assigneeId, createdBy, taskTitle }) {
      try {
         const creator = await User.findByPk(createdBy);
         if (!creator) {
            logger.error(`Creator with ID ${createdBy} not found`);
            throw new Error('Creator not found');
         }

         const notification = await Notifications.create({
            userId: assigneeId,
            taskId: taskId,
            content: `Bạn đã được ${creator.fullName} giao task "${taskTitle}"`,
            type: 'NEW_TASK',  // Changed from 'TASK_ASSIGNED' to 'NEW_TASK'
            isRead: false,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
         });

         logger.info(`Created task assignment notification for user ${assigneeId}`);
         return notification;
      } catch (error) {
         logger.error(`Error creating task assignment notification: ${error.message}`);
         throw error;
      }
   }
}

export default NotificationService;