const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log(req.user, req.headers.authorization);
    if (req.user) {
      req.user = req.user;
    } else if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      const isCustomAuth = token.length < 500;
      console.log(isCustomAuth);
      let decodeData;
      if (token && isCustomAuth) {
        decodedData = jwt.verify(token, "secret");

        req.userId = decodedData?.id;
      } else {
        decodedData = jwt.decode(token);
        req.userId = decodedData?.sub;
      }
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
