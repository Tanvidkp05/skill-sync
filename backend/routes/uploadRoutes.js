const express = require("express");
const multer = require("multer");
const path = require('path');
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Configure Multer storage for resume and profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume") {
      cb(null, path.join(__dirname, "../public/resume"));
    } else if (file.fieldname === "profile") {
      cb(null, path.join(__dirname, "../public/profile"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "resume" && file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed for resumes"));
    }
    if (file.fieldname === "profile" && !["image/jpeg", "image/png"].includes(file.mimetype)) {
      return cb(new Error("Only JPG and PNG files are allowed for profile images"));
    }
    cb(null, true);
  },
});

// Route to upload resume (PDF)
router.post("/resume", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileUrl = `/host/resume/${req.file.filename}`;
  res.json({ message: "Resume uploaded successfully", url: fileUrl });
});

// Route to upload profile picture (JPG or PNG)
router.post("/profile", upload.single("profile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileUrl = `/host/profile/${req.file.filename}`;
  res.json({ message: "Profile image uploaded successfully", url: fileUrl });
});

module.exports=router;