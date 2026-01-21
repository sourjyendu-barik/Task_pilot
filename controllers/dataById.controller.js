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
      // 1️⃣ Join project to get project info
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
      { $unwind: "$projectDetails" },

      // 2️⃣ Group by project to count all tasks
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
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
          },
          toDoTasks: {
            $sum: { $cond: [{ $eq: ["$status", "To Do"] }, 1, 0] },
          },
          blockedTasks: {
            $sum: { $cond: [{ $eq: ["$status", "Blocked"] }, 1, 0] },
          },
        },
      },

      // 3️⃣ Join tasks again to check teams for user membership
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "project",
          as: "tasks",
        },
      },
      { $unwind: "$tasks" },

      // 4️⃣ Join teams
      {
        $lookup: {
          from: "teams",
          localField: "tasks.team",
          foreignField: "_id",
          as: "teamDetails",
        },
      },
      { $unwind: "$teamDetails" },

      // 5️⃣ Filter only tasks where the user is in the team
      { $match: { "teamDetails.members": userObjectId } },

      // 6️⃣ Re-group to remove duplicate projects after user filtering
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          createdAt: { $first: "$createdAt" },
          totalTasks: { $first: "$totalTasks" },
          completedTasks: { $first: "$completedTasks" },
          inProgressTasks: { $first: "$inProgressTasks" },
          toDoTasks: { $first: "$toDoTasks" },
          blockedTasks: { $first: "$blockedTasks" },
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
