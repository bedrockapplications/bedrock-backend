const asyncHandler = require("express-async-handler");
const Chat= require("../models/chatModel");
const Message=require("../models/messageModel");
const chatapi=require("../models/chatapiModel");

const {uploadToS3}=require("../controllers/s3");
const SaveChat = asyncHandler(async (req, res) => {
    
    try {
      
      const uploadSingle = uploadToS3("bedrockapp-media").array("media");

      uploadSingle(req, res, async (err) => {
        if (err)
          return res.status(400).json({ success: false, message: err.message });

          
    
        
      
        if(req.files){
          
          req.files.forEach(async(e) => {
            const ExistingChats=await Chat.find({senderId:req.body.senderId,receiverId:req.body.receiverId});
          
           
            let attachment=e.location!=null? e.location:req.body.lastMessage;
            let savedchat=null;
            let samechat=null;
            if(ExistingChats.length==0){
              samechat=await Chat.find({senderId:req.body.receiverId,receiverId:req.body.senderId});
              if(samechat.length==0){
              const data = new Chat({
                  senderId: req.body.senderId,
                  receiverId: req.body.receiverId,
                  lastMessage:attachment,
              });
          
         savedchat = await data.save();
            }
         
          }
          
        const message = new Message({
          senderId: req.body.senderId,
          receiverId: req.body.receiverId,
          chatId:savedchat!=null?savedchat._id:(samechat!=null?samechat[0]._id:ExistingChats[0]._id),
          text:attachment,
      });

      
      
      
          await message.save();
          
          if(ExistingChats.length>0 || (samechat!=null && samechat.length>0)){
            
            await Chat.updateOne(
              { "_id" : samechat!=null?samechat[0]._id:ExistingChats[0]._id },
              { $set: { lastMessage : attachment} });
            
          }
          });

          
        }
        
        else{
          
            const ExistingChats=await Chat.find({senderId:req.body.senderId,receiverId:req.body.receiverId});
            
            let savedchat=null;
            let samechat=null;
            if(ExistingChats.length==0){
              samechat=await Chat.find({senderId:req.body.receiverId,receiverId:req.body.senderId});
              if(samechat.length==0){
              const data = new Chat({
                  senderId: req.body.senderId,
                  receiverId: req.body.receiverId,
                  lastMessage:req.body.lastMessage,
              });
          
         savedchat = await data.save();
         }
         
          }
          
        const message = new Message({
          senderId: req.body.senderId,
          receiverId: req.body.receiverId,
          chatId: savedchat!=null?savedchat._id:(samechat!=null?samechat[0]._id:ExistingChats[0]._id),
          text:req.body.lastMessage,
      });

      
      
          
          await message.save();
         
          if(ExistingChats.length>0 || (samechat!=null && samechat.length>0)){
            await Chat.updateOne(
              { "_id" : samechat!=null?samechat[0]._id:ExistingChats[0]._id },
              { $set: { lastMessage : req.body.lastMessage} });
            
          }
          
         
        }
        
        

      res.json(" message Sent SuccessFully");
    });
    } catch(err) {
      console.log("Error mesg",err);
      res.status(400);
      throw new Error("Bad Request");
    }
  
  });


  const getChatsbyId = asyncHandler(async (req, res) => {
    const chats=await Chat.find({$and:[{senderId:{$in:[req.query.senderId,req.query.receiverId]}},{receiverId:{$in:[req.query.senderId,req.query.receiverId]}}]})

    if(chats.length>0){
       const ExistingChats=await Message.find({chatId:chats[0]._id}).sort({ updatedAt: 1 });
      console.log(ExistingChats);
    if (ExistingChats) {
        res.status(200).send(ExistingChats);
    } else {
        res.status(400);
      throw new Error("Bad request");
     
    }

    }
  });

  const getKey = asyncHandler(async (req, res) => {

    const ExistingKey=await chatapi.find();
    
       if (ExistingKey) {
           res.status(200).send(ExistingKey);
       } else {
           res.status(400);
         throw new Error("Bad request");
        
       }
     });

  module.exports={SaveChat,getChatsbyId,getKey}
