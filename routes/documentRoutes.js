const express = require("express");
const router = express.Router();
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const {
  uploadDocument,
  getDocuments,
  updateDocuments,
  getFileNameList,
  deleteDocumentById,
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
      file.mimetype === "application/msword" ||
      file.mimetype === "application/pdf"
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

const singleupload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("docs");

const multiupload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).array("docs");

const meetingupload = multer({
  storage: meetingstorage,
  fileFilter: fileFilter,
}).single("attachment");

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null,file.originalname);
      },
    }),
  });

const uploadToS3 = (req, res, next) => {
  const uploadSingle = upload("bedrockapp-media").single(
    "image"
  );

  uploadSingle(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });

   console.log(req.file);

    res.status(200).json({ data: req.file });
  });
};

router.post("/uploadDocument", multiupload, uploadDocument);
router.get("/getDocs", getDocuments);
router.get("/getFileNames", getFileNameList);
router.put("/updateDocument/:_id", updateDocuments);
router.delete("/deleteDocument/:_id", deleteDocumentById);

router.post("/createMeeting", meetingupload, createMeeting);
router.get("/getMeetings", getMeetingsbyId);
router.delete("/deletemeeting/:_id", deleteMeetingbyId);
module.exports = router;
