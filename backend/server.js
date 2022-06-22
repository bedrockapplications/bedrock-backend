const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./db");
const cors = require("cors");
connectDb();
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
);
app.use("/save", require("./routes/userRoutes.js"));
app.use("/update", require("./routes/userRoutes.js"));
app.use("/resetpassword", require("./routes/userRoutes.js"));
app.use("/find", require("./routes/userRoutes.js"));
app.use("/user", require("./routes/userRoutes.js"));
app.use("/security", require("./routes/userRoutes.js"));

app.use(errorHandler);

app.listen(3000, () => {
  console.log("server started on port 3000");
});
