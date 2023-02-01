const mongoose = require("mongoose");

const chatapikeySchema = mongoose.Schema(
  {
    apikey: String,
    value: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chatapikey", chatapikeySchema);
