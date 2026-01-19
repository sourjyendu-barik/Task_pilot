const { default: mongoose } = require("mongoose");
const User = require("../models/model.user");

const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      message:
        users.length > 0
          ? "Users data fetched successfully"
          : "Currently there are no users",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const findUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "User id is not valid" });
    }

    // SECURITY: Only allow current user or admin
    if (id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: "User is not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User Details found." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = { allUsers, findUserById };
