const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  collectedAmount: { type: Number, default: 0 },
  hidden: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Campaign", campaignSchema);
