import NotificationService from './NotificationService.js';

class FileService {
   // Khi upload file
   static async uploadFile(fileData, uploaderId) {
      try {
         const uploader = await User.findByPk(uploaderId);

         // Thông báo cho các thành viên liên quan
         await NotificationService.notifyFileUpload(
            relatedUserIds, // Array của user IDs
            fileData.fileName,
            uploader.name
         );

         return /* kết quả upload file */;
      } catch (error) {
         throw new Error(`Lỗi khi upload file: ${error.message}`);
      }
   }
}