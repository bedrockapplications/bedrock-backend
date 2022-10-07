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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("document", documentSchema);
