const express = require("express");
const { SaveChat, getChatsbyId } = require("../controllers/chatController");
const router = express.Router();

router.post("/createChat", SaveChat);
router.get("/getMessages", getChatsbyId);

module.exports=router;