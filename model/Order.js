const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  Email: {
    type: String,
  },
  Items: {
    type: String,
  },
  Status: {
    type: String,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
