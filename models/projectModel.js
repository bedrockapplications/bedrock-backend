const mongoose = require("mongoose"); 

const projectSchema = mongoose.Schema( 
  {
    projectName: String,
    ClientPhNumber: Number,
    Address: String,
    City: String,
    State: String,
    Zipcode: Number,
    StartDate: String,
    Photos: [
      {
        data: Buffer,
        contentType: String,
        _id: false,
      },
    ],
    Blueprints: [
      {
        data: Buffer,
        contentType: String,
        _id: false,
      },
    ],
    Documents: [
      {
        data: Buffer,
        contentType: String,
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("project", projectSchema);
