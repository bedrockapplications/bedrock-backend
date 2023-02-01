const asyncHandler = require("express-async-handler");
const Chat= require("../models/chatModel");
const Message=require("../models/messageModel");
const chatapi=require("../models/chatapiModel");
const SaveChat = asyncHandler(async (req, res) => {
    console.log("inside save method");
  
    const ExistingChats=await Chat.find({senderId:req.body.senderId,receiverId:req.body.receiverId});
   console.log(ExistingChats);
   console.log(ExistingChats.length);
    try {
        let savedchat=null;
        if(ExistingChats.length==0){
            const data = new Chat({
                senderId: req.body.senderId,
                receiverId: req.body.receiverId,
                lastMessage:req.body.lastMessage
            });
        
       savedchat = await data.save();
       console.log(savedchat._id);
        }
        console.log(savedchat);
      const message = new Message({
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        chatId: savedchat?savedchat._id:ExistingChats._id,
        text:req.body.lastMessage,
       // media:"abc"
    });
    
    console.log(message);
        await message.save();

      res.json({message:"Sent SuccessFully"});
    } catch {
      res.status(400);
      throw new Error("Bad Request");
    }
  });


  const getChatsbyId = asyncHandler(async (req, res) => {

 const ExistingChats=await Message.find({$and:[{senderId:req.query.senderId},{receiverId:req.query.receiverId}]}).sort({ updatedAt: -1 });
 console.log(ExistingChats);
    if (ExistingChats) {
        res.status(200).send(ExistingChats);
    } else {
        res.status(400);
      throw new Error("Bad request");
     
    }
  });

  const getKey = asyncHandler(async (req, res) => {

    const ExistingKey=await chatapi.find();
    console.log(ExistingKey);
       if (ExistingKey) {
           res.status(200).send(ExistingKey);
       } else {
           res.status(400);
         throw new Error("Bad request");
        
       }
     });

  module.exports={SaveChat,getChatsbyId,getKey}