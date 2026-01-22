const mongoose = require("mongoose");
const Task = require("../models/model.task");

const getUserProjects = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(id);

    const userProjects = await Task.aggregate([
      // 1. Filter user's tasks
      {
        $lookup: {
          from: "teams",
          localField: "team",
          foreignField: "_id",
          as: "teamDetails",
        },
      },
      { $unwind: "$teamDetails" },
      { $match: { "teamDetails.members": userObjectId } },

      // 2. Get project details
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
      { $unwind: "$projectDetails" },

      // 3. Group + count ALL user's tasks
      {
        $group: {
          _id: "$projectDetails._id",
          name: { $first: "$projectDetails.name" },
          description: { $first: "$projectDetails.description" },
          createdAt: { $first: "$projectDetails.createdAt" },

          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
        },
      },

      // 4. Simple logic: ALL completed → "Completed", else "In Progress"
      {
        $addFields: {
          projectStatus: {
            $cond: {
              if: { $eq: ["$completedTasks", "$totalTasks"] },
              then: "Completed",
              else: "In Progress",
            },
          },
        },
      },

      // 5. Clean output
      {
        $project: {
          name: 1,
          description: 1,
          createdAt: 1,
          projectStatus: 1,
          _id: 1,
        },
      },

      { $sort: { name: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: `Found ${userProjects.length} projects`,
      data: userProjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getsTasksByUsers = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    const tasksOfUser = await Task.aggregate([
      {
        $lookup: {
          from: "teams",
          localField: "team",
          foreignField: "_id",
          as: "teamDetails",
        },
      },
      { $unwind: "$teamDetails" },
      { $match: { "teamDetails.members": new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "owners",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $group: {
          _id: "$_id", // task _id
          name: { $first: "$name" }, // keep task name
          status: { $first: "$status" }, // task status
          team: { $first: "$teamDetails" }, // keep team info
          owners: { $push: "$ownerDetails" }, // collect all owner objects
        },
      },
    ]);
    res.status(200).json({
      success: true,
      totalTasks: tasksOfUser.length,
      data: tasksOfUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { getUserProjects, getsTasksByUsers };
