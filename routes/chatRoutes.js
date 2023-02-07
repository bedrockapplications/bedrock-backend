const express = require("express");
const { SaveChat, getChatsbyId, getKey } = require("../controllers/chatController");
const router = express.Router();

router.post("/createChat", SaveChat);
router.get("/getMessages", getChatsbyId);
router.get("/getKey", getKey);

module.exports=router;