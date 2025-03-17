import cron from 'node-cron';
import { Op } from 'sequelize';
import Task from '../model/Task.js'; // Import model Task
import Notification from '../model/Notifications.js';
import logger from '../utils/logger.js';

// Job to clean up expired notifications
cron.schedule('0 0 * * *', async () => {
   try {
      logger.info('Running notification cleanup job...');
      const result = await Notification.destroy({
         where: {
            expiresAt: {
               [Op.lt]: new Date()
            }
         }
      });
      logger.info(`Cleaned up ${result} expired notifications`);
   } catch (error) {
      logger.error(`Error cleaning up notifications: ${error.message}`);
   }
});

// Job to check for upcoming task deadlines
cron.schedule('*/5 * * * *', async () => {
   try {
      logger.info('Checking for upcoming task deadlines...');
      const tasks = await Task.findAll({
         where: {
            endDate: {
               [Op.lte]: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // Tasks ending in the next 24 hours
            },
            status: {
               [Op.ne]: 3 // Tasks that are not completed
            }
         }
      });

      for (const task of tasks) {
         // Logic to send notification about upcoming task deadline
         await Notification.create({
            userId: task.assigneeId,
            message: `Task "${task.title}" is due soon.`,
            expiresAt: new Date(task.endDate.getTime() + 24 * 60 * 60 * 1000) // Notification expires 24 hours after task end date
         });
      }
   } catch (error) {
      logger.error(`Error checking task deadlines: ${error.message}`);
   }
});

// Log that cron jobs are initialized
console.log('Notification cron jobs initialized');