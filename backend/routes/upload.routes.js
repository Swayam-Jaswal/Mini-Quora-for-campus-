const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { verifyToken } = require("../middlewares/auth.middleware");


const router = express.Router();


cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
cloudinary,
params: {
folder: "updates",
resource_type: "auto",
},
});


const upload = multer({ storage });


router.post(
"/",
verifyToken,
upload.array("file", 10),
(req, res) => {
try {
if (!req.files || req.files.length === 0) {
return res.status(400).json({ message: "No files uploaded" });
}


const out = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
res.json({ files: out });
} catch (err) {
console.error(err);
res.status(500).json({ message: "Upload failed" });
}
}
);


module.exports = router;