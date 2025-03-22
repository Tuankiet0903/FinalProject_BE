import { env } from './environment.js';
import dotenv from 'dotenv';
dotenv.config();

const FE_URL = process.env.FE_URL;

const WHITELIST_DOMAINS = [
  FE_URL
]

export const corsOptions = {
    origin: function (origin, callback) {
      // Cho phép gọi API bằng Postman (origin = undefined) trên môi trường dev
      if (!origin && env.BUILD_MODE === 'dev') {
        return callback(null, true);
      }
  
      // Kiểm tra xem origin có thuộc danh sách được phép hay không
      if (WHITELIST_DOMAINS.includes(origin) || origin.includes("Postman")) {
        return callback(null, true);
      }
  
      // Nếu không thuộc danh sách, trả về lỗi
      const error = new Error(`${origin} is not allowed by our CORS policy.`);
      error.statusCode = 403; // Mã lỗi HTTP Forbidden
      return callback(error);
    },
  
    // Một số trình duyệt cũ (như IE11, SmartTVs) có vấn đề với mã trạng thái 204
    optionsSuccessStatus: 200,
  
    // Cho phép chia sẻ cookie và thông tin xác thực
    credentials: true,
};