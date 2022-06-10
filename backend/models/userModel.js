const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
  {
    companyName: String,
    companyPhNumber: Number,
    companycurrentAddress: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
    },
  },
  { _id: false }
);
const billingSchema = mongoose.Schema(
  {
    achRoutingNumber: Number,
    achAccountNumber: Number,
    BillingAddress: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
    },
  },
  { _id: false }
);
const secQuesSchema = mongoose.Schema(
  {
    schoolName: String,
    bornCity: String,
  },
  { _id: false }
);
const userScheme = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please add a firstname"],
    },
    lastName: {
      type: String,
      required: [true, "please add a lastname"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "please add a email"],
    },
    password: {
      type: String,
      required: [true, "please add a password"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "please add a Phone Number"],
    },
    securityQuestions: secQuesSchema,
    companyInformation: companySchema,
    billingInformation: billingSchema,
  },
  {
    timestamps: true,
  }
);

//module.exports = mongoose.model("User", userScheme);
module.exports = mongoose.model("userinfo", userScheme);
