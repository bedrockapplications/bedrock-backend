const express = require("express");
const router = express.Router();
const {
  saveUser,
  updateUser,
  saveContractors,
  getRoleBasedUserDetails,
  getUserbyEmail,
  loginUser,
  getUserDetails,
  updatePassword,
  SecurityCheck,
  passwordCheck,
} = require("../controllers/userController");
const { route } = require("./documentRoutes");

router.post("/save", saveUser);
router.put("/update/:_id", updateUser);
router.post("/saveContractors", saveContractors);
router.get("/findrolebasedusers", getRoleBasedUserDetails);
router.put("/resetpassword", updatePassword);
router.get("/finduser", getUserbyEmail);
router.get("/details", getUserDetails);
router.post("/login", loginUser);
router.get("/securitycheck", SecurityCheck);
router.get("/passwordCheck", passwordCheck);
module.exports = router;
