import cron from 'node-cron';
import { Op } from 'sequelize';
import Notifications from '../model/Notifications.js';

// Cleanup expired notifications - runs every hour
cron.schedule('0 * * * *', async () => {
   console.log('Running notification cleanup job...');
   try {
      const deleted = await Notifications.destroy({
         where: {
            expiresAt: {
               [Op.lt]: new Date()
            }
         }
      });
      console.log(`Cleaned up ${deleted} expired notifications`);
   } catch (error) {
      console.error('Error cleaning up notifications:', error);
   }
});

// Check for upcoming task deadlines - runs every 12 hours
cron.schedule('0 */12 * * *', async () => {
   console.log('Checking for upcoming task deadlines...');
   try {
      const upcomingTasks = await Task.findAll({
         where: {
            endDate: {
               [Op.between]: [
                  new Date(),
                  new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
               ]
            },
            status: {
               [Op.ne]: 'COMPLETED'
            }
         },
         include: [{
            model: User,
            attributes: ['userId']
         }]
      });

      for (const task of upcomingTasks) {
         await Notifications.create({
            userId: task.User.userId,
            taskId: task.id,
            content: `Task "${task.name}" sẽ đến hạn vào ngày ${task.endDate}`,
            type: 'DEADLINE_REMINDER',
            isRead: false,
            expiresAt: task.endDate
         });
      }
      console.log(`Created reminders for ${upcomingTasks.length} upcoming tasks`);
   } catch (error) {
      console.error('Error checking task deadlines:', error);
   }
});

// Log that cron jobs are initialized
console.log('Notification cron jobs initialized');