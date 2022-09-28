const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  Email: {
    type: String,
  },
  Items: {
    type: Array,
  },
  Status: {
    type: String,
    default: "Processing",
  },
});

module.exports = mongoose.model("Order", OrderSchema);
