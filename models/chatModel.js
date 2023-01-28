const mongoose = require("mongoose");

const chatSchema=mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
    lastMessage: String
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("chatroom", chatSchema);
