const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const saveUser = asyncHandler(async (req, res) => {
  console.log("inside save method");

  const data = new User({
    firstName: req.body.firstName,
    lastName: req.body.firstName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    securityQuestions: req.body.securityQuestions,
    companyInformation: req.body.companyInformation,
    billingInformation: req.body.billingInformation,
  });
  try {
    const saveduser = await data.save();
  } catch {
    throw new Error("Duplicate Email, please enter a different email");
  }
  const saveduser = await data.save();

  res.json(saveduser);
});

const getUserbyEmail = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.query.email });
  if (exists) {
    res.send("Email Already Exists,Please signin with another email");
  } else {
    res.status(200).send("done");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  console.log("inside update method");

  const email = req.body.email,
    fname = req.body.firstName,
    lname = req.body.lastName,
    password = req.body.password,
    phone = req.body.phoneNumber,
    securityQuestions = req.body.securityQuestions,
    companyInformation = req.body.companyInformation,
    billingInformation = req.body.billingInformation; //id = req.params._id,

  User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        email: email,
        firstName: fname,
        lastName: lname,
        password: password,
        phoneNumber: phone,
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
  const { email, password, schoolName, bornCity } = req.body;
  User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        password: password,
      },
    },
    { new: true },
    (err, data) => {
      if (err) {
        res.send("Error");
      } else {
        if (data != null) {
          res.send("Password updated Successfully");
        } else res.send("Email Not Found");
      }
    }
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.password == password) {
    //await bcrypt.compare(password, user.password)
    res.status(201).json(user);
  } else {
    res
      .status(400)
      .send("The email or password you entered is incorrect, please try again");
  }
});

module.exports = {
  saveUser,
  updateUser,
  getUserbyEmail,
  loginUser,
  updatePassword,
};
