const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MerchSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  Description: {
    type: String,
  },
  Sizes: {
    type: Array,
  },
  Colors: {
    type: Array,
  },
  PhotoUrl: {
    type: String,
  },
  Price: {
    type: Number,
  },
  Quantity: {
    type: Number,
  },
  Type: {
    type: String,
  },
});

module.exports = mongoose.model("Merch", MerchSchema);
