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

    const userId = new mongoose.Types.ObjectId(id);

    const projects = await Task.aggregate([
      // 1️⃣ Join team
      {
        $lookup: {
          from: "teams",
          localField: "team",
          foreignField: "_id",
          as: "team",
        },
      },
      { $unwind: "$team" },

      // 2️⃣ User must be team member
      {
        $match: {
          "team.members": userId,
        },
      },

      // 3️⃣ Join project
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },

      // 4️⃣ GROUP BY PROJECT
      {
        $group: {
          _id: "$project._id",
          name: { $first: "$project.name" },
          description: { $first: "$project.description" },
          createdAt: { $first: "$project.createdAt" },

          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $set: {
          projectStatus: {
            $cond: {
              if: { $eq: ["$totalTasks", "$completedTasks"] },
              then: "Completed",
              else: "In Progress",
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: projects,
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

      {
        $match: {
          "teamDetails.members": new mongoose.Types.ObjectId(id),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "owners",
          foreignField: "_id",
          as: "owners",
        },
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          status: { $first: "$status" },
          dueDate: { $first: "$dueDate" },
          team: { $first: "$teamDetails" },
          owners: { $first: "$owners" },
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
