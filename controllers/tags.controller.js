const Tag = require("../models/model.tag");
const mongoose = require("mongoose");

const addTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name field is missing" });
    }
    const exists = await Tag.findOne({ name });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "This tag is already exists" });
    }
    return res
      .status(201)
      .json({ success: true, message: "New tag created successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "This tag is already exists" });
    }
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: "Name field is missing" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const alltags = async (req, res) => {
  try {
    const allTagList = await Tag.find();
    return res.status(200).json({
      success: true,
      message: allTagList ? "Tags data found" : "No tags data available",
      data: allTagList,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteTagById = async (req, res) => {
  try {
    const tagId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      return res.status(400).json({
        message: "The tag id is invalid",
        success: false,
      });
    }
    const deletedTag = await Tag.findByIdAndDelete(tagId);
    if (!deletedTag) {
      return res.status(404).json({
        message: "The tag is not found",
        success: false,
      });
    }
    return res.status(200).json({
      mesage: "The tag is deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
module.exports = { addTag, alltags, deleteTagById };
