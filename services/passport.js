const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Token = require("../model/Token");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async function (accessToken, _, profile, cb) {
      try {
        const tokenData = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.firstName,
          image: profile.photos[0].value,
        };

        const token = await Token.findOne({
          googleId: profile.id,
        });
        if (token) {
          return cb(null, token._id);
        } else {
          const newToken = await Token.create(tokenData);
          await newToken.save();
          cb(null, newToken._id);
        }
      } catch (err) {
        cb(err, null);
      }
    }
  )
);

passport.serializeUser((token, done) => {
  done(null, token);
});

passport.deserializeUser(async (id, done) => {
  try {
    const token = await Token.findById(id);

    done(null, token);
  } catch (err) {
    done(err, null);
  }
});
module.exports = passport;
