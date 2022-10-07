const mongoose = require("mongoose");

const meetingSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    startDate: {
      type: Date,
      min: new Date(),
    },
    endDate: {
      type: Date,
      min: new Date(),
    },
    startTime: String,
    endTime: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("meeting", meetingSchema);
