"use strict";

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "image", ext).replace(/\s+/g, "_").slice(0, 60);
    cb(null, `${base}-${Date.now()}${ext || ".png"}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file?.mimetype) return cb(null, false);
  if (/^image\//.test(file.mimetype)) return cb(null, true);
  cb(new Error("Only image uploads are allowed"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

module.exports = { upload, uploadsDir };
