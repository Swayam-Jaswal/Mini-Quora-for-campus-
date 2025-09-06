const mongoose = require("mongoose");

const moderatorCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
     unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("ModeratorCode", moderatorCodeSchema);