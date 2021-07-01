const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { urlencoded } = require("express");
require("dotenv").config();

const app = express();

const store = new MongoDBStore({
  uri: process.env.MongoURI,
  collection: "mySessions",
});
new mongoose.connect(process.env.MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose connected");
});

app.use(
  session({
    name: "nomadId",
    maxAge: "1h",
    secret: "jnfnnsmnksdsdknsd",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 week
    },
  })
);

app.use(morgan("dev"));
app.use(express.json({ urlencoded: false }));
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    "Access-Control-Allow-Origin": "*",
  })
);

require("./services/passport");
require("./services/passportJwt");
app.use("/", require("./routes/auth"));
app.use("/api", require("./routes/index.js"));

app.listen(4000, () => {
  console.log("Server started");
});
