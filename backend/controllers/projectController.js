const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");

const uploadProject = asyncHandler(async (req, res) => {
  try {
    const projectupload = new Project({
      projectName: req.body.projectName,
      ClientPhNumber: req.body.ClientPhNumber,
      Address: req.body.Address,
      City: req.body.City,
      State: req.body.State,
      Zipcode: req.body.Zipcode,
      Acreage: req.body.Acreage,
      BuildingSplit: req.body.BuildingSplit,
      ConcreteSplit: req.body.ConcreteSplit,
      StartDate: req.body.StartDate,
      Photos: {
        data: req.files.Photos[0].filename,
        contentType: req.files.Photos[0].mimetype,
      },
      Blueprints: {
        data: req.files.Blueprints[0].filename,
        contentType: req.files.Blueprints[0].mimetype,
      },
      Documents: {
        data: req.files.Documents[0].filename,
        contentType: req.files.Documents[0].mimetype,
      },
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
