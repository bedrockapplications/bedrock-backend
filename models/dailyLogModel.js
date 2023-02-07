const mongoose = require("mongoose");

const schedulePlanChangeSchema = mongoose.Schema(
  {
    
      activity: String,
      contractor: String,
      comments: String,
    
  },
  { _id: false }
);
const manpowerSchema = mongoose.Schema(
  {
   
      team: String,
      count: Number,
      hours: Number,
      comments: String,
  
  },
  { _id: false }
);
const visitorInspectionSchema = mongoose.Schema(
    {
       
          entryType: String,
          name: String,
          comments: String,
        
      },
      { _id: false }
);
const investoryDataSchema = mongoose.Schema(
    {
        
          type: String,
          material: String,
          quantity: Number,
          unitsOfMeasure: String,
     
      },
      { _id: false }
);
const onSiteIssuesSchema = mongoose.Schema(
    {
       
          type: String,
          reasons: String,
          comments: String,
        
      },
      { _id: false }
);
const dailyLogScheme = mongoose.Schema(
  {
    project: String,
    reportingPerson: String,
    workCompleted: String,
    address: String,
    country: String,
    state: String,
    city: String,
    zipcode:Number,
    weather: String,
    weatherStatus: String,
    weatherCondition: String,
    comments: String,
    notes: String,
    signature :{
      fileName:String,
      filePath:String,
      contentType: String,
      _id: false,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userinfo" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
    schedulePlanChange: [schedulePlanChangeSchema],
    manpower: [manpowerSchema],
    visitorInspection: [visitorInspectionSchema],
    investoryData: [investoryDataSchema],
    onSiteIssues: [onSiteIssuesSchema],
    docs: [
      {
        filePath: String,
        contentType: String,
        fileName:String,
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("dailyLog", dailyLogScheme);
