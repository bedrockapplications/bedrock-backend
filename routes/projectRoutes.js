const express = require("express");
const router = express.Router();
const {
  uploadProject,
  getProjects,
  getProjectById,
} = require("../controllers/projectController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "Blueprints" || file.fieldname === "Documents") {
    // if uploading pdf
    if (file.mimetype === "application/pdf") {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      return cb(
        new Error(
          file.mimetype + " is not allowed for " + file.fieldname + " field"
        )
      ); //cb(null, false); // else fails
    }
  } else {
    // else uploading image
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      return cb(new Error(file.mimetype + "  is not allowed for Photos field")); //cb(null, false); // else fails
    }
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).fields([
  { name: "Photos", maxCount: 8 },
  { name: "Blueprints", maxCount: 8 },
  { name: "Documents", maxCount: 8 },
]);

router.post("/upload", upload, uploadProject);
router.get("/getprojects", getProjects);
router.get("/getprojectdetailsbyid", getProjectById);
module.exports = router;

