const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtpSchema = new mongoose.Schema({
  Email: {
    type: String,
  },
  Otp: {
    type: String,
  },
});

module.exports = mongoose.model("Otp", OtpSchema);
