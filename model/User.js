const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  Email: {
    type: String,
  },
  Password: {
    type: String,
  },
  Name: {
    type: String
  },
  PhoneNumber:{
    type: String
  },
  IsAdmin:{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", UserSchema);
