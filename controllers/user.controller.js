const User = require("../models/model.user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const addNewUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(409)
        .json({ success: false, message: "Email already Exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({
      message: "new user is created",
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
      success: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email already Exists" });
    }
    res.status(500).json({ message: error.message, success: false });
  }
};

const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User is not found" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Email or Password is incorrect" });
    }
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: "1d" });
    res
      .status(200)
      .json({ success: true, token, message: "Token created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { addNewUser, authLogin };
