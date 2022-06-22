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

router.post("/", saveUser);
router.put("/:email", updateUser);
router.put("/", updatePassword);
router.get("/email", getUserbyEmail);
router.post("/login", loginUser);
router.get("/check", SecurityCheck);
module.exports = router;
