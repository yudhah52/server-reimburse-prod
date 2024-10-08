require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authLogin = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token)
    return res.json({
      success: false,
      msg: "Access Denied !",
    });

  const user = await User.findOne({ where: { token: token } });
  if (!user)
    return res.json({
      success: false,
      msg: "Access Denied !",
    });

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    req.userAuth = user;
    req.token = token;
    next();
  } catch (err) {
    return res.json({
      success: false,
      msg: "Invalid Token !",
    });
  }
};

module.exports = authLogin;
