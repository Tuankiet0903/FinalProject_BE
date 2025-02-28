import jwt from "jsonwebtoken";
import ENV from "../config/config.js";

export default function Auth(req, res, next) {
   try {
      let token;

      // Lấy token từ cookie nếu có
      if (req.cookies?.token) {
         token = req.cookies.token;
         console.log("Token from cookies:", token); // Log token từ cookies
      }
      // Nếu không có trong cookie, lấy token từ header Authorization
      else if (req.headers.authorization?.startsWith("Bearer ")) {
         token = req.headers.authorization.split(" ")[1];
         console.log("Token from header:", token); // Log token từ header
      }

      if (!token) {
         return res.status(403).json({ error: "Vui lòng cung cấp token!" });
      }

      // Giải mã token và gán thông tin người dùng vào req.user
      const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
      req.user = decodedToken;
      console.log("Decoded user:", req.user); // Log thông tin user

      if (!req.user.userId) {
         console.error("❌ Token không chứa userId hợp lệ:", req.user);
         return res.status(401).json({ error: "Người dùng không hợp lệ!" });
      }

      // Tiếp tục đến route tiếp theo nếu không có lỗi
      next();
   } catch (error) {
      handleTokenError(error, res);
   }
}

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
