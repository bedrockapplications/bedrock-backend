const asyncHandler = require("express-async-handler");
const Docs = require("../models/documentModel");
const Meeting = require("../models/meetingModel");
const fs = require("fs");

const uploadDocument = asyncHandler(async (req, res) => {
  try {
    let DocArray = [];
    console.log(req.files);
    req.files.forEach((e) => {
      const val = {
        data: fs.readFileSync("uploads/" + e.filename),
        contentType: e.mimetype,
        fileName: e.originalname,
      };
      DocArray.push(val);
    });
    const docupload = new Docs({
      status: "In Review",
      documents: DocArray,
      userId: req.body.userId,
      projectId: req.body.projectId,
      categoryType: req.body.categoryType,
    });
    const saveddocument = await docupload.save();
    res.send(saveddocument);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const getDocuments = asyncHandler(async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const uid = req.query.userId;
    const result = {};

    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;

    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await Docs.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    const data = await Docs.find({ userId: uid })
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec();
    //await Docs.countDocuments().exec();

    let dd = [];
    let st = [];
    let pt = [];
    data.forEach((e) => {
      if (e.categoryType == "DesignDocuments") {
        dd.push(e);
      } else if (e.categoryType == "Submittals") {
        st.push(e);
      } else if (e.categoryType == "Photos") {
        pt.push(e);
      }
    });
    result.DesignDocuments = dd;
    result.Submittals = st;
    result.Photos = pt;
    result.totalPosts = data.length;
    result.rowsPerPage = limit;
    return res.json({ data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
});

const getDocsbyName = asyncHandler(async (req, res) => {
  let value = req.query.fileName;
  const searchnames = await Docs.find({
    fileName: { $regex: new RegExp("^" + value, "i") },
  }).exec();
  res.json(searchnames);
});

const getDocsDynamically = asyncHandler(async (req, res) => {
  let Filterquery = [];

  if (req.query.userId !== "" && req.query.userId != undefined) {
    Filterquery.push({ userId: req.query.userId });
  }
  if (req.query.projectId !== "" && req.query.projectId != undefined) {
    Filterquery.push({ projectId: req.query.projectId });
  }
  if (req.query.categoryType !== "" && req.query.categoryType != undefined) {
    Filterquery.push({
      categoryType: req.query.categoryType,
    });
  }

  const dynamicparams = await Docs.find({
    $and: Filterquery,
  }).exec();
  res.json(dynamicparams);
});

const updateDocuments = asyncHandler(async (req, res) => {
  const upobj = {};
  const docid = req.params._id;
  const dbdocument = await Docs.findById(docid);
  if (
    dbdocument.fileName != req.file.originalname &&
    dbdocument.ContentType != req.file.mimetype
  ) {
    upobj["fileName"] = req.file.originalname;
    upobj["contentType"] = req.file.mimetype;
    upobj["documents.data"] = fs.readFileSync("documents/" + req.file.filename);
  }
  if (dbdocument.userId != req.body.userId && req.body.userId != "") {
    upobj["userId"] = req.body.userId;
  }
  //console.log("projectId from db", dbdocument.projectId);
  //console.log("projectId from req", req.body.projectId);
  if (dbdocument.projectId != req.body.projectId && req.body.projectId != "") {
    upobj["projectId"] = req.body.projectId;
  }
  if (
    dbdocument.categoryType != req.body.categoryType &&
    req.body.categoryType != ""
  ) {
    upobj["categoryType"] = req.body.categoryType;
  }
  console.log("updated obj", upobj);
  Docs.findOneAndUpdate(
    { _id: docid },
    {
      $set: upobj,
    },
    { new: true },
    (err, data) => {
      if (err) {
        res.send("Error");
      } else {
        if (data != null) {
          res.send(data);
        } else res.send("Document Not Found");
      }
    }
  );
});

const deleteDocumentById = asyncHandler(async (req, res) => {
  const delDocument = await Docs.findByIdAndDelete(req.params._id);
  res.json(delDocument.fileName + " is Deleted Successfully");
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
  getDocsbyName,
  getDocsDynamically,
  updateDocuments,
  deleteDocumentById,
  createMeeting,
  getMeetingsbyId,
  deleteMeetingbyId,
};
