const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadDocument,
  getDocuments,
  getDocsbyName,
  createMeeting,
  getMeetingsbyId,
  deleteMeetingbyId,
} = require("../controllers/documentController");
const storage = multer.diskStorage({
  destination: "documents",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const meetingstorage = multer.diskStorage({
  destination: "attachments",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "docs" || file.fieldname === "attachment") {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      return cb(
        new Error(
          file.mimetype + " is not allowed for " + file.fieldname + " field"
        )
      );
    }
  } else {
    return cb(new Error(file.mimetype + " test " + file.fieldname + " field"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("docs");

const meetingupload = multer({
  storage: meetingstorage,
  fileFilter: fileFilter,
}).single("attachment");

router.post("/uploadDocument", upload, uploadDocument);
router.get("/getDocs", getDocuments);
router.get("/getDocsByName", getDocsbyName);

router.post("/createMeeting", meetingupload, createMeeting);
router.get("/getMeetings", getMeetingsbyId);
router.delete("/deletemeeting/:_id", deleteMeetingbyId);
module.exports = router;
