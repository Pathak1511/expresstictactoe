const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: [true, "Name is required"],
  },

  userName: {
    type: String,
    unique: true,
    required: [true, "User Name is required"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
    required: [true, "Email required"],
  },
  password: {
    type: String,
    required: true,
  },
  PlayedByme: {
    type: [],
  },
  PlayedByOther: {
    type: [],
  },
  session: Boolean,
  AcceptRequest: {
    type: [],
  },
});

const playerData = mongoose.model("Player", PlayerSchema);

module.exports = playerData;
