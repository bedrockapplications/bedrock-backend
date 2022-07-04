const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    projectName: String,
    ClientPhNumber: Number,
    Address: String,
    City: String,
    State: String,
    Zipcode: Number,
    Acreage: Number,
    BuildingSplit: String,
    ConcreteSplit: String,
    StartDate: String,
    Photos: {
      data: Buffer,
      contentType: String,
    },
    Blueprints: {
      data: Buffer,
      contentType: String,
    },
    Documents: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("project", projectSchema);
