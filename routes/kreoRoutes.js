const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadFileToKreo, getTokens, getProjectStatus
} = require("../controllers/kreoApiController");


const kreostorage = multer.diskStorage({
    destination: "kreouploads",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const kreoupload = multer({
    storage: kreostorage,
   // fileFilter: fileFilter,
  }).single("attachment");

router.post("/uploadToKreo",kreoupload, uploadFileToKreo);
router.get("/authenticate",getTokens);
router.get("/getProjectDetails",getProjectStatus);

module.exports = router;