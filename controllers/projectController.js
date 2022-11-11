const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const fs = require("fs");

const uploadProject = asyncHandler(async (req, res) => {
  try {
    // let photoArray = [],
    //   BpArray = [],
    //   docArray = [];
    // req.files.Photos.forEach((e) => {
    //   const val = {
    //     data: fs.readFileSync("uploads/" + e.filename),
    //     contentType: e.mimetype,
    //   };
    //   photoArray.push(val);
    // });

    // req.files.Blueprints.forEach((element) => {
    //   const val = {
    //     data: element.filename,
    //     contentType: element.mimetype,
    //   };
    //   BpArray.push(val);
    // });

    // req.files.Documents.forEach((element) => {
    //   const val = {
    //     data: element.filename,
    //     contentType: element.mimetype,
    //   };
    //   docArray.push(val);
    // });
    console.log("project detials", req.body);
    const projectupload = new Project({
      projectName: req.body.projectName,
      ClientPhNumber: req.body.ClientPhNumber,
      Address: req.body.Address,
      City: req.body.City,
      State: req.body.State,
      Zipcode: req.body.Zipcode,
      StartDate: req.body.StartDate,
      // Photos: photoArray,
      // Blueprints: BpArray,
      // Documents: docArray,
      userId: req.body.userId,
    });
    const savedproject = await projectupload.save();
    res.send(savedproject);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const updateProject = asyncHandler(async (req, res) => {
  const upobj = {};
  let pid = req.params._id;

  const dbproject = await Project.findById(pid);

  if (
    dbproject.projectName != req.body.projectName &&
    req.body.projectName != "" &&
    req.body.projectName != undefined
  ) {
    upobj["projectName"] = req.body.projectName;
  }

  if (
    dbproject.Address != req.body.Address &&
    req.body.Address != "" &&
    req.body.Address != undefined
  ) {
    upobj["Address"] = req.body.Address;
  }
  if (
    dbproject.City != req.body.City &&
    req.body.City != "" &&
    req.body.City != undefined
  ) {
    upobj["City"] = req.body.City;
  }
  if (
    dbproject.State != req.body.State &&
    req.body.State != "" &&
    req.body.State != undefined
  ) {
    upobj["State"] = req.body.State;
  }
  if (
    dbproject.Zipcode != req.body.Zipcode &&
    req.body.Zipcode != "" &&
    req.body.Zipcode != undefined
  ) {
    upobj["Zipcode"] = req.body.Zipcode;
  }
  if (
    dbproject.ClientPhNumber != req.body.ClientPhNumber &&
    req.body.ClientPhNumber != "" &&
    req.body.ClientPhNumber != undefined
  ) {
    upobj["ClientPhNumber"] = req.body.ClientPhNumber;
  }
  if (
    dbproject.StartDate != req.body.StartDate &&
    req.body.StartDate != "" &&
    req.body.StartDate != undefined
  ) {
    upobj["StartDate"] = req.body.StartDate;
  }

  Project.findOneAndUpdate(
    { _id: pid },
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
        } else res.status(404).send("Project Not Found");
      }
    }
  );
});

const getProjects = asyncHandler(async (req, res) => {
  const allData = await Project.find({ userId: req.query.userId }).populate({
    path: "userId",
    select: ["firstName", "lastName"],
  });
  res.json(allData);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById({ _id: req.query._id });
  res.json(project);
});

module.exports = { uploadProject, updateProject, getProjects, getProjectById };
