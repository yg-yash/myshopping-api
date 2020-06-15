const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
