const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./db");
const cors = require("cors");
connectDb();
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const { errorHandler } = require("./middleware/middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/user", require("./routes/userRoutes.js"));
app.use("/api/project", require("./routes/projectRoutes.js"));
app.use("/api/document", require("./routes/documentRoutes.js"));

app.use(errorHandler);

app.listen(3000, () => {
  console.log("server started on port 3000");
});
