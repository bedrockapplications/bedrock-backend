const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./db");
connectDb();
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/middleware.js");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);

app.use("/save", require("./routes/userRoutes.js"));
app.use("/update", require("./routes/userRoutes.js"));
app.use("/resetpassword", require("./routes/userRoutes.js"));
app.use("/find", require("./routes/userRoutes.js"));
app.use("/user", require("./routes/userRoutes.js"));

app.listen(3000, () => {
  console.log("server started on port 3000");
});
