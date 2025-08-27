const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // images, pdf, docs etc.
      folder: "answers",
    });

    fs.unlinkSync(req.file.path); // remove temp file

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
