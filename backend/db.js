const mangoose = require("mongoose");

const connectDb = async () => {
  try {
    const con = await mangoose.connect(process.env.MONGO_URI);
    console.log("connected");
  } catch (error) {
    console.error("error");
    process.exit(1);
  }
};

module.exports = connectDb;
