import multer from "multer";
import path from "path";

const destination = path.resolve("temp");
const filename = (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}_${file.originalname}`);
};

const storage = multer.diskStorage({
    destination,
    filename
})

const upload = multer({ storage });

export default upload; 