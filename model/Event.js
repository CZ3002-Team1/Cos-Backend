const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  Description: {
    type: String,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  Time: {
    type: String,
  },
  PhotoUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Event", EventSchema);
