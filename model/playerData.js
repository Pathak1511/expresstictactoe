const mongoose = require("mongoose");

const playerDataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
});

const playerData = mongoose.model("PlayerData", playerDataSchema);

module.exports = playerData;
