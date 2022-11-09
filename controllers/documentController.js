const asyncHandler = require("express-async-handler");
const Docs = require("../models/documentModel");
const Meeting = require("../models/meetingModel");
const fs = require("fs");

const uploadDocument = asyncHandler(async (req, res) => {
  try {
    let DocArray = [];

    req.files.forEach((e) => {
      let ctype = e.originalname.split(".");
      const val = {
        data: fs.readFileSync("documents/" + e.filename),
        contentType: ctype[1],
        fileName: ctype[0],
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

    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }

    if (!value || value == undefined) {
      const data = await Docs.find({ $and: Filterquery })
        .populate({
          path: "projectId",
          select: ["projectName"],
        })
        .sort("-_id")
        .skip(startIndex)
        .limit(limit)
        .exec();

      data.forEach((e) => {
        if (e.categoryType == "DesignDocuments") {
          dd.push(e);
          ddLength += e.documents.length;
        } else if (e.categoryType == "Submittals") {
          stLength += e.documents.length;
          st.push(e);
        } else if (e.categoryType == "Photos") {
          ptLength += e.documents.length;
          pt.push(e);
        }
      });
      result.totalPosts = data.length;
    } else {
      const data = await Docs.find({
        $and: [
          { "documents.fileName": { $regex: new RegExp("^" + value, "i") } },
          { projectId: pid },
        ],
      }).exec();

      data.forEach((e) => {
        let rsp = e.documents.filter((x) => x.fileName.includes(value));
        e.documents = rsp;
        if (e.categoryType == "DesignDocuments") {
          ddLength += e.documents.length;
          dd.push(e);
        } else if (e.categoryType == "Submittals") {
          stLength += e.documents.length;
          st.push(e);
        } else if (e.categoryType == "Photos") {
          ptLength += e.documents.length;
          pt.push(e);
        }
      });
      result.totalPosts = data.length;
    }
    //await Docs.countDocuments().exec();
    if (endIndex < result.totalPosts) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }

    result.DesignDocuments = dd;
    result.Submittals = st;
    result.Photos = pt;
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

const getDocsbyName = asyncHandler(async (req, res) => {
  let value = req.query.fileName;
  const searchnames = await Docs.find({
    $and: [
      // { "documents.fileName": { $regex: new RegExp("^" + value, "i") } },
      {
        documents: {
          $elemMatch: { fileName: { $regex: new RegExp("^" + value, "i") } },
        },
      },
      //{ "documents._id": req.query.mediaId },
      { projectId: pid },
    ],
  }).exec();
  let rsp = {};
  let a = searchnames.map((e) => {
    //console.log("main obj", e);
    return e.documents.filter((x) => x.fileName.includes(value));
  });
  res.json(a);
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
  if (dbdocument.fileName != req.body.fileName) {
    upobj["documents.$.fileName"] = req.body.fileName;
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
    { _id: docid, "documents._id": req.body.mediaId },
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
});

const deleteDocumentById = asyncHandler(async (req, res) => {
  const dbdata = await Docs.findById({ _id: req.query._id });
  if (dbdata.documents.length > 1) {
    const test = await Docs.updateOne(
      { _id: req.query._id },
      { $pull: { documents: { _id: req.query.mediaId } } },
      { multi: true }
    );
  } else {
    const del = await Docs.findByIdAndDelete(req.query._id);
  }
  res.json("Deleted Successfully");
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
