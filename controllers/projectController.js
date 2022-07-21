const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");

const uploadProject = asyncHandler(async (req, res) => {
  try {
    let photoArray = [],
      BpArray = [],
      docArray = [];
    req.files.Photos.forEach((e) => {
      const val = {
        data: e.filename,
        contentType: e.mimetype,
      };
      photoArray.push(val);
    });

    req.files.Blueprints.forEach((element) => {
      const val = {
        data: element.filename,
        contentType: element.mimetype,
      };
      BpArray.push(val);
    });

    req.files.Documents.forEach((element) => {
      const val = {
        data: element.filename,
        contentType: element.mimetype,
      };
      docArray.push(val);
    });

    const projectupload = new Project({
      projectName: req.body.projectName,
      ClientPhNumber: req.body.ClientPhNumber,
      Address: req.body.Address,
      City: req.body.City,
      State: req.body.State,
      Zipcode: req.body.Zipcode,
      StartDate: req.body.StartDate,
      Photos: photoArray,
      Blueprints: BpArray,
      Documents: docArray,
    });
    const savedproject = await projectupload.save();
    res.send(savedproject);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const getProjects = asyncHandler(async (req, res) => {
  const allData = await Project.find();
  res.json(allData);
});

module.exports = { uploadProject, getProjects };
