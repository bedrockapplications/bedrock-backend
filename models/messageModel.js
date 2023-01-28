const mongoose = require("mongoose");

const messageSchema=mongoose.Schema({
    text:String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chatroom" },
    media:String
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("message", messageSchema);
