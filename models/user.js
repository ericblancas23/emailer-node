const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: [5, "too short, min is 5 characters long"],
    max: [32, "32 is the max length"],
  },
  email: {
    type: String,
    min: [5, "too short, min is 5 characters long"],
    max: [32, "32 is the max length"],
    unique: true,
    lowercase: true,
    required: "email is required",
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  password: {
    type: String,
    min: [5, "too short, min is 5 characters long"],
    max: [32, "32 is the max length"],
    require: "password is required",
  },
});

userSchema.statics.EncryptPassword = async (password) => {
  const hash = await bcrypt.hash(password, 12);
};

module.exports = mongoose.model("User", userSchema);
