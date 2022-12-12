const asyncHandler = require("express-async-handler");
const Docs = require("../models/documentModel");
const Meeting = require("../models/meetingModel");
const fs = require("fs");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
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

const uploadDocument = asyncHandler(async (req, res) => {
  try {
    let DocArray = [];

    const uploadSingle = upload("bedrockapp-media").array("docs");

    uploadSingle(req, res, async (err) => {
      if (err)
        return res.status(400).json({ success: false, message: err.message });

      req.files.forEach((e) => {
        let ctype = e.originalname.substring(
          e.originalname.lastIndexOf(".") + 1,
          e.originalname.length
        );
        let fn = e.originalname.substring(0, e.originalname.lastIndexOf("."));

        let insertData = {
          status: "In Review",
          fileName: fn,
          contentType: ctype,
          fileType: e.mimetype,
          userId: req.body.userId,
          projectId: req.body.projectId,
          filePath: e.location,
          categoryType: req.body.categoryType,
        };

        DocArray.push(insertData);
      });

      await Docs.insertMany(DocArray);
      res.send("Saved SuccessFully");
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
    throw new Error(err.message);
  }
});

const getDocuments = asyncHandler(async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const uid = req.query.userId;
    const pid = req.query.projectId;
    const result = {};

    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;

    let Filterquery = [];

    let dd = [];
    let st = [];
    let pt = [];
    let value = req.query.fileName;
    let ddLength = 0;
    let stLength = 0;
    let ptLength = 0;

    if (uid !== "" && uid != undefined) {
      Filterquery.push({ userId: uid });
    }
    if (pid !== "" && pid != undefined) {
      Filterquery.push({ projectId: pid });
    }
    if (req.query.categoryType !== "" && req.query.categoryType != undefined) {
      Filterquery.push({ categoryType: req.query.categoryType });
    }
    if (value != "" && value != undefined) {
      Filterquery.push({
        fileName: { $regex: new RegExp("^" + value, "i") },
      });
    }

    const data = await Docs.find({ $and: Filterquery }, { documents: 0 })
      .populate({
        path: "projectId",
        select: ["projectName"],
      })
      .sort({ updatedAt: -1 });

    data.forEach((e) => {
      if (e.categoryType == "DesignDocuments") {
        dd.push(e);
        ddLength++;
      } else if (e.categoryType == "Submittals") {
        st.push(e);
        stLength++;
      } else if (e.categoryType == "Photos") {
        pt.push(e);
        ptLength++;
      }
    });

    result.DesignDocuments =
      dd.length > 0 ? dd.slice(startIndex, endIndex) : dd;
    result.Submittals = st.length > 0 ? st.slice(startIndex, endIndex) : st;
    result.Photos = pt.length > 0 ? pt.slice(startIndex, endIndex) : pt;
    result.DesignDocumentsCount = ddLength;
    result.SubmittalsCount = stLength;
    result.PhotosCount = ptLength;
    result.rowsPerPage = limit;
    return res.json({ data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
});

const updateDocuments = asyncHandler(async (req, res) => {
  try {
    const upobj = {};
    const docid = req.params._id;
    const dbdocument = await Docs.findById(docid);
    if (
      dbdocument.fileName != req.body.fileName &&
      req.body.fileName != "" &&
      req.body.fileName != undefined
    ) {
      upobj["fileName"] = req.body.fileName;
    }
    if (
      dbdocument.userId != req.body.userId &&
      req.body.userId != "" &&
      req.body.userId != undefined
    ) {
      upobj["userId"] = req.body.userId;
    }

    if (
      dbdocument.projectId != req.body.projectId &&
      req.body.projectId != "" &&
      req.body.projectId != undefined
    ) {
      upobj["projectId"] = req.body.projectId;
    }
    if (
      dbdocument.categoryType != req.body.categoryType &&
      req.body.categoryType != "" &&
      req.body.categoryType != undefined
    ) {
      upobj["categoryType"] = req.body.categoryType;
    }
    Docs.findOneAndUpdate(
      { _id: docid },
      {
        $set: upobj,
      },
      { new: true },
      (err, data) => {
        if (err) {
          res.status(400);
          throw new Error("Error");
        } else {
          if (data != null) {
            res.send(data);
          } else res.status(404).send("Document Not Found");
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Sorry, something went wrong" });
  }
});

const deleteDocumentById = asyncHandler(async (req, res) => {
  try {
    const del = await Docs.findByIdAndDelete(req.params._id);
    res.json("Deleted Successfully");
  } catch (error) {
    return res.status(400).json({ msg: "Sorry, something went wrong" });
  }
});

const getFileNameList = asyncHandler(async (req, res) => {
  try {
    const uid = req.query.userId;
    const pid = req.query.projectId;
    const ctype = req.query.categoryType;
    let Filterquery = [];
    if (uid !== "" && uid != undefined) {
      Filterquery.push({ userId: uid });
    }
    if (ctype !== "" && ctype != undefined) {
      Filterquery.push({ categoryType: ctype });
    }
    if (pid !== "" && pid != undefined) {
      Filterquery.push({ projectId: pid });
    }

    const fileList = await Docs.find(
      { $and: Filterquery },
      { fileName: 1, _id: 0 }
    );
    let fList = [];
    fileList.forEach((e) => {
      fList.push(e.fileName);
    });
    res.send(fList);
  } catch (error) {
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
});

const createMeeting = asyncHandler(async (req, res) => {
  try {
    const meeting = new Meeting({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      attachments: {
        data: fs.readFileSync("attachments/" + req.file.filename),
        filename: req.file.filename,
      },
      partiesInvolved: req.body.partiesInvolved,
      userId: req.body.userId,
    });
    const savedmeeting = await meeting.save();
    res.send(savedmeeting);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const getMeetingsbyId = asyncHandler(async (req, res) => {
  const date = req.query.startDate.toString();
  const userMeeting = await Meeting.find({
    $and: [{ userId: req.query.userId }, { startDate: date }],
  });
  res.json(userMeeting);
});

const deleteMeetingbyId = asyncHandler(async (req, res) => {
  const delMeeting = await Meeting.findByIdAndDelete(req.params._id);
  res.json(delMeeting.title + " Deleted Successfully");
});

module.exports = {
  uploadDocument,
  getDocuments,
  updateDocuments,
  getFileNameList,
  deleteDocumentById,
  createMeeting,
  getMeetingsbyId,
  deleteMeetingbyId,
};
