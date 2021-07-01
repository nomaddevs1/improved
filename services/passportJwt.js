const passport = require("passport");
const path = require("path");
const fs = require("fs");
const User = require("../model/User");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

// const PUB_KEY = fs.readFileSync(__dirname + "/../key/jwtRS256.key");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      console.log(payload);
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = { passport };
