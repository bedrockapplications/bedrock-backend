const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./db");
const cors = require("cors");
const path = require("path");
const moment=require("moment");
connectDb();
const app = express();
const http = require("http").createServer(app);
const axios = require('axios');
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const socketIO = require("socket.io")(http,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const { errorHandler } = require("./middleware/middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/user", require("./routes/userRoutes.js"));
app.use("/api/project", require("./routes/projectRoutes.js"));
app.use("/api/document", require("./routes/documentRoutes.js"));
app.use("/api/chats", require("./routes/chatRoutes.js"));
app.use("/api/dailyLog", require("./routes/dailyLogRoutes"));
app.use("/api/external",require("./routes/kreoRoutes"));
app.use(errorHandler);




app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});




http.listen(port, () => {
  console.log("server started on port 3000");
});

socketIO.on("connection", function (socket) {
  console.log("server",socket.id);
    socket.on("getUser",data=>{

      setInterval(async() => {
    
        var event = new Date();
        var dt = new Date(event.getTime() - event.getTimezoneOffset() * 60000)
        .toISOString()
        .substring(0, 10);  
       
       var respArray=[]; //http://localhost:3000/api/document/getMeetings?userId=62a496a33d1e6cb6f54efa53&startDate=2023-01-19
        var rep=await axios.get("https://nodejs-apis.bedrockapps.link/api/document/getMeetingRead?userId="+data.id+"&startDate="+dt)
     
        .then(res =>{ 
           let datas=res.data;
           if(datas.length>0){
              let yetsdate=datas.filter(e=>!(Date.parse(e.startDate)>=Date.parse(dt.toString())));
              if(yetsdate.length>0)
                respArray.push(yetsdate);
              datas.filter(dts=>!yetsdate.includes(dts)).map(element=>{
                let date =new Date(new Date().toLocaleString('en-US', { timeZone: data.tz }));
                let result1 = moment(date).add(16, 'minutes').format("HH:mm");
                let time = new Date("January 1, 2022 " + element.startTime);
                //let ttt = time.getHours() + ":" + time.getMinutes();
                let actualTime=moment(date).format("HH:mm");
                let recTime=moment(time).format("HH:mm");
                var format = 'hh:mm'
                var rTime = moment(recTime,format),
                beforeTime = moment(actualTime, format),
                afterTime = moment(result1, format);//element.startTime===result1.toString()
                if(rTime.isBetween(beforeTime, afterTime)){
                  respArray.push(element);
                }
          });
        }

            socket.emit("response",respArray.length);
         
         })
         .catch(err => console.log(err));
       
      }, 60000);
    })
  

  
});
