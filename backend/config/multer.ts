import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100 MB max for video/image uploads
    }
});