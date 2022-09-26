const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MerchSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  Description: {
    type: String,
  },
  Size: {
    type: String,
  },
  PhotoUrl: {
    type: String,
  },
  Price:{
    type: Number
  },
  Quantity:{
    type: Number
  }
});

module.exports = mongoose.model("Merch", MerchSchema);
