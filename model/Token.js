const mongoose = require("mongoose");

const { Schema } = mongoose;

const tokenSchema = new Schema({
  googleId: String,
  displayName: String,
  firstName: String,
  image: String,
});

module.exports = mongoose.model("Token", tokenSchema);
