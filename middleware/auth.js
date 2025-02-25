import jwt from "jsonwebtoken";
import ENV from "../config/config.js";

/**
 * Middleware xác thực người dùng bằng JWT.
 * Kiểm tra token hợp lệ và gán thông tin người dùng vào req.user.
 */
export default function Auth(req, res, next) {
   try {
      let token;

      // Ưu tiên lấy token từ Cookie trước
      if (req.cookies?.token) {
         token = req.cookies.token;
         // console.log("🔹 Token lấy từ Cookies:", token);
      }
      // Nếu không có trong Cookies, thử lấy từ Header Authorization
      else if (req.headers.authorization?.startsWith("Bearer ")) {
         token = req.headers.authorization.split(" ")[1];
         // console.log("🔹 Token lấy từ Authorization Header:", token);
      }

      if (!token) {
         console.error("❌ Không tìm thấy token trong Cookie hoặc Authorization Header.");
         return res.status(403).json({ error: "Vui lòng cung cấp token!" });
      }

      // Giải mã token và gán thông tin người dùng vào req.user
      const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
      console.log("✅ Token decoded:", decodedToken);
      req.user = decodedToken;

      if (!req.user.userId) {
         console.error("❌ Token không chứa userId hợp lệ:", req.user);
         return res.status(401).json({ error: "Người dùng không hợp lệ!" });
      }

      // Nếu tất cả đều hợp lệ, tiếp tục đến route tiếp theo
      next();
   } catch (error) {
      handleTokenError(error, res);
   }
}

/**
 * Hàm xử lý lỗi token một cách chi tiết.
 */
function handleTokenError(error, res) {
   if (error instanceof jwt.JsonWebTokenError) {
      console.error("❌ Lỗi xác thực: Token không hợp lệ.", error.message);
      return res.status(401).json({ error: "Token không hợp lệ! Vui lòng đăng nhập lại." });
   } else if (error instanceof jwt.TokenExpiredError) {
      console.error("❌ Lỗi xác thực: Token đã hết hạn.", error.message);
      return res.status(401).json({ error: "Token đã hết hạn! Vui lòng đăng nhập lại." });
   } else {
      console.error("❌ Lỗi xác thực không xác định:", error.message);
      return res.status(500).json({ error: "Lỗi xác thực! Vui lòng thử lại sau." });
   }
}
