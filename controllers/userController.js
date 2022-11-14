const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const saveUser = asyncHandler(async (req, res) => {
  console.log("inside save method");

  const salt = await bcrypt.genSalt(10);
  const hp = await bcrypt.hash(req.body.password, salt);
  const data = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hp,
    phoneNumber: req.body.phoneNumber,
    role: "",
    securityQuestions: req.body.securityQuestions,
    companyInformation: req.body.companyInformation,
    billingInformation: req.body.billingInformation,
  });

  try {
    const saveduser = await data.save();
    res.json(saveduser);
  } catch {
    throw new Error("Duplicate Email, please enter a different email");
  }
});

const getUserbyEmail = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.query.email });
  if (exists) {
    res.status(400);
    throw new Error("Email Already Exists,Please signin with another email");
  } else {
    res.status(200).send({ success: "done" });
  }
});

const getUserDetails = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ _id: req.query._id });
  if (exists) {
    res.status(200).send(exists);
  } else {
    throw new Error("User Does not Exist");
  }
});

const SecurityCheck = asyncHandler(async (req, res) => {
  const userexists = await User.findOne({ email: req.query.email });
  const sclname = req.query.schoolName,
    born = req.query.bornCity;

  if (userexists) {
    if (
      userexists.securityQuestions.schoolName == sclname &&
      userexists.securityQuestions.bornCity == born
    ) {
      res.send({ success: "valid" });
    } else {
      res.status(400);
      throw new Error("Invalid Security Answers");
    }
  } else {
    throw new Error("User not found");
  }
});
const updateUser = asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hp = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email,
    fname = req.body.firstName,
    lname = req.body.lastName,
    password = hp,
    phone = req.body.phoneNumber,
    role = "",
    securityQuestions = req.body.securityQuestions,
    companyInformation = req.body.companyInformation,
    billingInformation = req.body.billingInformation; //id = req.params._id,

  User.findOneAndUpdate(
    { _id: req.params._id },
    {
      $set: {
        email: email,
        firstName: fname,
        lastName: lname,
        password: password,
        phoneNumber: phone,
        role: role,
        securityQuestions,
        companyInformation,
        billingInformation,
      },
    },
    { new: true },
    (err, data) => {
      if (err) {
        res.send("Error");
      } else {
        if (data != null) {
          res.send(data);
        } else res.send("Email Not Found");
      }
    }
  );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hp = await bcrypt.hash(password, salt);
  User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        password: hp,
      },
    },
    { new: true },
    (err, data) => {
      if (err) {
        throw new Error("Error");
      } else {
        if (data != null) {
          res.send({ success: "Password updated Successfully" });
        } else {
          res.status(500);
          res.send({ message: "Email Not Found " });
          //throw new Error("Email Not Found ");
        }
      }
    }
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error(
      "The email or password you entered is incorrect, please try again"
    );
  }
});

module.exports = {
  saveUser,
  updateUser,
  getUserbyEmail,
  getUserDetails,
  loginUser,
  updatePassword,
  SecurityCheck,
};
