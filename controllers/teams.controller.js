const { default: mongoose } = require("mongoose");
const Team = require("../models/model.team");

const addTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name || !description || members.length < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Team already exists",
      });
    }
    const newTeam = new Team({ name, description, members });
    await newTeam.save();
    return res.status(201).json({
      success: true,
      message: "New team created successfully",
      data: newTeam,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Team with this name already exists",
      });
    }
    if (error.name === "ValidationError") {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Validation error",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID",
      });
    }
    const required_team = await Team.findById(id).populate("members");
    if (!required_team) {
      return res.status(404).json({
        success: false,
        message: "Team data not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Team data  found",
      data: required_team,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const allteams = async (req, res) => {
  try {
    const allteamsList = await Team.find().populate("members");
    return res.status(200).json({
      success: true,
      message: allteamsList.length ? "Team data found" : "No teams available",
      data: allteamsList,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const teamid = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(teamid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID",
      });
    }

    const deleted_team = await Team.findByIdAndDelete(teamid);
    if (!deleted_team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const addMember = async (req, res) => {
  try {
    const { newMembers } = req.body;
    const teamId = req.params.id;
    if (!newMembers || !Array.isArray(newMembers) || newMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing attribute",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: "The team id is invalid",
      });
    }
    const invalidMemberId = newMembers.find(
      (m) => !mongoose.Types.ObjectId.isValid(m)
    );
    if (invalidMemberId) {
      return res.status(400).json({
        success: false,
        message: "At least one member id is invalid",
      });
    }
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        $addToSet: {
          members: { $each: newMembers }, // prevents duplicates
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedTeam) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Added new members successfully",
      data: updatedTeam,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteMember = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { memberId } = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(teamId) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "The team id or member id is invalid",
      });
    }
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $pull: { members: memberId } }, // removes the single member

      { new: true, runValidators: true }
    );
    if (!updatedTeam) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addTeam,
  getTeam,
  allteams,
  deleteTeam,
  addMember,
  deleteMember,
};
