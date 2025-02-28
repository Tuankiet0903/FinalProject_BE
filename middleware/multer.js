import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads/"); // Thư mục lưu file
   },
   filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // Lấy phần mở rộng từ tên file
      cb(null, file.fieldname + "-" + Date.now() + ext);
   }
});

const upload = multer({ storage: storage });

export { upload };
