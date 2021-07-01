const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../model/User");
const Joi = require("joi");

function validator(user) {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9(%$@#)]{3,30}$")),
  });
  return schema.validate(user);
}

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate(["google", "jwt"], {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    console.log(req.user, 1);
    res.redirect("/streams/edit");
  }
);

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.send();
});

router.post("/auth/login", async (req, res) => {
  const { error } = validator(req.body);
  if (error) {
    return res.status(400).send({ message: error.message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({ message: "User with the email not found" });
  }
  const passwordValidator = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordValidator) {
    return res.status(404).send({ message: "Wrong password" });
  }
  const token = user.generateToken();
  res.send({ token });
});

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { error } = validator(req.body);
    if (error) {
      console.log(req.body);
      return res.status(400).send({ message: error.message });
    }
    const user = await User.findOne({ email: req.body.email });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    if (user && user.password === null) {
      const updatedUser = { ...user, password: hashPassword };
      const update = await User.findByIdAndUpdate(user._id, updatedUser);
      await update.save();
    }
    if (user) {
      return res.status(403).send({ message: "User with the email  found" });
    }

    const newUser = await new User({
      ...req.body,
      password: hashPassword,
    });
    const token = newUser.generateToken();
    if (token) {
      newUser.save();
      return res.send({ token });
    }
    return res.send({ message: "Internal Error" });
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
