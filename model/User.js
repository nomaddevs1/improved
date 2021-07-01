const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

// const PUB_KEY = fs.readFileSync(__dirname + "/../key/jwtRS256.key");

const userSchema = new Schema({
  email: String,
  password: String,
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      id: this._id,
    },
    "secret"
  );
  return token;
};
module.exports = mongoose.model("User", userSchema);
