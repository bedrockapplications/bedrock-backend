const mongoose = require("mongoose");

const documentSchema = mongoose.Schema(
  {
    fileName: String,
    contentType: String,
    status: String,
    documents: {
      data: Buffer,
      _id: false,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
    categoryType: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("document", documentSchema);
