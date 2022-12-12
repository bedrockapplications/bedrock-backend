const mongoose = require("mongoose");

const documentSchema = mongoose.Schema(
  {
    status: String,
    //documents: Buffer,
    fileName: String,
    contentType: String,
    fileType: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
    categoryType: String,
    filePath: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("document", documentSchema);
