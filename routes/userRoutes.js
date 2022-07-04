const express = require("express");
const router = express.Router();
const {
  saveUser,
  updateUser,
  getUserbyEmail,
  loginUser,
  updatePassword,
  SecurityCheck,
} = require("../controllers/userController");

router.post("/save", saveUser);
router.put("/update/:email", updateUser);
router.put("/resetpassword", updatePassword);
router.get("/finduser", getUserbyEmail);
router.post("/login", loginUser);
router.get("/securitycheck", SecurityCheck);
module.exports = router;
