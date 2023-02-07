const DailyLog = require("../models/dailyLogModel");
const asyncHandler = require("express-async-handler");

const fs = require("fs");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const createDailyLog = asyncHandler(async (req, res) => {
  console.log("inside createDailyLog method");

  const uploadSingle = upload("bedrockapp-media").fields([
      { name: "signature", maxCount: 1 },
      { name: "docs", maxCount: 8 },
    ]);
  
    let photoArray = [];
    uploadSingle(req, res, async (err) => {
      if (err)
        return res.status(400).json({ success: false, message: err.message });

    req.files.docs.forEach((e) => {
        let ctype = e.originalname.substring(
            e.originalname.lastIndexOf(".") + 1,
            e.originalname.length
          );
          let fn = e.originalname.substring(0, e.originalname.lastIndexOf("."));
      const val = {
        filePath: e.location,
        contentType: ctype,
        fileName:fn,
      };
      photoArray.push(val);
    });
    let sign = req.files.signature[0];
    console.log("sign",sign);
    console.log("request",req.files);
    const signatureVal = {
        filePath: sign.location,
        contentType: sign.originalname.substring(
            sign.originalname.lastIndexOf(".") + 1,
            sign.originalname.length
          ),
        fileName:sign.originalname.substring(0, sign.originalname.lastIndexOf(".")),
      };
        const data = new DailyLog({
            project: req.body.project,
            reportingPerson: req.body.reportingPerson,
            workCompleted: req.body.workCompleted,
            address: req.body.address,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            zipcode: req.body.zipcode,
            weather: req.body.weather,
            weatherStatus: req.body.weatherStatus,
            weatherCondition: req.body.weatherCondition,
            comments:req.body.comments,
            notes:req.body.notes,
            userId:req.body.userId,
            projectId:req.body.projectId,
            signature:signatureVal,
            schedulePlanChange: req.body.schedulePlanChange,
            manpower: req.body.manpower,
            visitorInspection: req.body.visitorInspection,
            investoryData: req.body.investoryData,
            onSiteIssues: req.body.onSiteIssues,
            docs:photoArray,
          });
          try {
            const saveDailyLog = await data.save();
            res.status(200).send({message:"Daily Log Saved SuccessFully"});
          } catch {
            res.status(400);
            throw new Error("Bad Request");
          }
    });
});

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  });

module.exports={createDailyLog}
