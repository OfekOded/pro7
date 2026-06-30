/**
 * middleware/upload.js — העלאת קבצי מדיה (multer) → UPLOAD_DIR.
 * ⚠️ STUB. דוגמה:
 *   import multer from "multer";
 *   import { env } from "../config/env.js";
 *   const storage = multer.diskStorage({
 *     destination: env.UPLOAD_DIR,
 *     filename: (req, file, cb) =>
 *       cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}-${file.originalname}`),
 *   });
 *   export const upload = multer({
 *     storage,
 *     limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
 *     fileFilter: (req, file, cb) =>
 *       cb(null, ["application/pdf","image/jpeg","image/png"].includes(file.mimetype)),
 *   });
 *
 * שימוש:  router.post("/documents", auth, upload.single("file"), documentController.upload);
 */

// TODO: לממש את הגדרת multer.
