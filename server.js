const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./db");
const cors = require("cors");
const path = require("path");
connectDb();
const app = express();
const http = require("http").createServer(app);
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const socketIO = require("socket.io")(http);
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

app.use(errorHandler);

function makeid() {
  // https.get("https://jsonplaceholder.typicode.com/posts/1", (res) => {
  //   console.log("response print");
  // });
  const event = new Date();
  var dt = new Date(event.getTime() - event.getTimezoneOffset() * 60000)
    .toISOString()
    .substring(0, 10);
  console.log(dt);
  app.get(
    "http://localhost:3000/api/document/getMeetings?userId=62a496a33d1e6cb6f54efa53&startDate=" +
      dt,
    (res) => {
      console.log(res);
    }
  );
  // var result = "";
  // var characters =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // var charactersLength = characters.length;
  // for (var i = 0; i < length; i++) {
  //   result += characters.charAt(Math.floor(Math.random() * charactersLength));
  // }
  // return result;
}

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

http.listen(3000, () => {
  console.log("server started on port 3000");
});

socketIO.on("connection", function (socket) {
  console.log("---> a user has connected!", socket.id);
  setInterval(() => {
    socket.emit("response", makeid());
  }, 60000);
});
