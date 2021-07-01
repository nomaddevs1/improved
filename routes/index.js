const express = require("express");
const requireLogin = require("../middleware/requireLogin");
const router = express.Router();
const User = require("../model/User");
const Token = require("../model/Token");
const Post = require("../model/Post");

router.get("/curent_user", requireLogin, async (req, res) => {
  try {
    if (req.user) {
      let userData = await Token.findById(req.user._id);

      if (userData) {
        res.json(userData);
      } else {
        res.status(404).send("Not Found");
      }
    } else if (req.userId) {
      let userData = await User.findById(req.user._id);

      if (userData) {
        res.json(userData);
      } else {
        res.status(404).send("Not Found");
      }
    } else {
      res
        .status(401)
        .json({ message: "You are not signed in. Sign in to view content" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    console.log(posts);
    if (!posts) return res.status(404).send("No posts");
    res.send(posts);
  } catch (err) {
    console.log(err);
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).send("No posts");
    res.send(posts);
  } catch (err) {
    console.log(err);
  }
});

router.post("/posts", requireLogin, async (req, res) => {
  const post = req.body;
  console.log(req.userId);
  console.log(post);
  const newPostMessage = new Post({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.delete("/destroy", async (req, res) => {
  await Post.deleteMany();
  res.send("All post deleted");
});

router.patch("/posts/:id", async (req, res) => {
  const post = await Post.findById(id);
  const updatedPost = { ...post, ...req.body };
  console.log(updatedPost);
});
module.exports = router;
