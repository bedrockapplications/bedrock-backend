const mongoose = require("mongoose");

const meetingSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    partiesInvolved: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("meeting", meetingSchema);
