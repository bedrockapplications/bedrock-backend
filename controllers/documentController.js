const asyncHandler = require("express-async-handler");
const Docs = require("../models/documentModel");
const Meeting = require("../models/meetingModel");
const fs = require("fs");

const uploadDocument = asyncHandler(async (req, res) => {
  try {
    const docupload = new Docs({
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      status: "In Review",
      documents: {
        data: fs.readFileSync("documents/" + req.file.filename),
      },
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
    const result = {};
    const totalPosts = await Docs.countDocuments().exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalPosts = totalPosts;
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
    result.data = await Docs.find()
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.rowsPerPage = limit;
    return res.json(result);
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

const createMeeting = asyncHandler(async (req, res) => {
  try {
    const meeting = new Meeting({
      title: req.body.title,
      description: req.body.description,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
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
  var date = new Date();
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });
  var formattedDate = year + "-" + month + "-" + day;
  const userMeeting = await Meeting.find({
    $and: [
      { userId: req.query.userId },
      { startDate: new Date(formattedDate) },
    ],
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
  createMeeting,
  getMeetingsbyId,
  deleteMeetingbyId,
};
