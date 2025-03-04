import { Server } from 'socket.io';
import logger from '../utils/logger.js';

class SocketService {
   constructor() {
      this.io = null;
   }

   initialize(server) {
      this.io = new Server(server, {
         cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
         }
      });

      this.io.on('connection', (socket) => {
         logger.info('Client connected:', socket.id);

         socket.on('join_notification_room', (userId) => {
            socket.join(`notification_${userId}`);
            logger.info(`User ${userId} joined notification room`);
         });

         socket.on('disconnect', () => {
            logger.info('Client disconnected:', socket.id);
         });
      });
   }

   emit(room, event, data) {
      if (this.io) {
         this.io.to(room).emit(event, data);
      }
   }
}

export default new SocketService();