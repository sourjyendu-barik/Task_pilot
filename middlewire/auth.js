const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authrization header missing." });
    }
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Authrization format." });
    }
    const token = authHeader.split(" ")[1];

    const decodedValue = jwt.verify(token, process.env.SECRETKEY);
    req.user = decodedValue;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
module.exports = auth;
