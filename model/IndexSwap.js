const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IndexSwapSchema = new mongoose.Schema({
  StudentName: {
    type: String,
  },
  Email: {
    type: String,
  },
  ModuleName: {
    type: String,
  },
  ModuleCode: {
    type: String,
  },
  HaveIndex: {
    type: String,
  },
  WantIndex: {
    type: String,
  },
  PhoneNumber: {
    type: String,
  },
  TeleHandle: {
    type: String,
  },
});

module.exports = mongoose.model("IndexSwap", IndexSwapSchema);
