const express = require("express");
const router = express.Router();
const {
  saveUser,
  updateUser,
  getUserbyEmail,
  loginUser,
  updatePassword,
} = require("../controllers/userController");

router.post("/", saveUser);
router.put("/:email", updateUser);
router.put("/", updatePassword);
router.get("/email", getUserbyEmail);
router.post("/login", loginUser);
module.exports = router;
