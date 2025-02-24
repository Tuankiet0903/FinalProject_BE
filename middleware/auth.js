import jwt from "jsonwebtoken";
import ENV from "../config/config.js";

export default function Auth(req, res, next) {
   try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
         console.error("❌ [Auth Middleware] Không có token trong header.");
         return res.status(403).json({ error: "Vui lòng cung cấp token!" });
      }

      const token = authorizationHeader.split(" ")[1];

      if (!token) {
         console.error("❌ [Auth Middleware] Token không hợp lệ.");
         return res.status(403).json({ error: "Token không hợp lệ!" });
      }

      try {
         const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
         req.user = decodedToken;

         if (!req.user || !req.user.userId) {
            console.error("❌ [Auth Middleware] userId không hợp lệ trong token:", req.user);
            return res.status(401).json({ error: "Người dùng không hợp lệ!" });
         }

         console.log(`✅ [Auth Middleware] Token hợp lệ! userId: ${req.user.userId}`);
         next();
      } catch (err) {
         console.error("🔥 [Auth Middleware] Lỗi xác thực JWT:", err.message);
         return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
      }
   } catch (error) {
      console.error("🔥 [Auth Middleware] Lỗi không xác định:", error);
      return res.status(500).json({ error: "Lỗi xác thực! Vui lòng thử lại." });
   }
}
