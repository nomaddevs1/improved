const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  name: String,
  creator: String,
  likes: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

var PostMessage = mongoose.model("PostMessage", postSchema);

module.exports = PostMessage;
