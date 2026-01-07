const Task = require("../models/model.task");

// GET /report/last-week : Fetch tasks completed in the last week. This can
// be calculated by querying tasks where the status is Completed and
// comparing the updatedAt field to the current date minus 7 days.

const lastWeekReport = async (req, res) => {
  try {
    const currentDate = new Date();
    const sevenDaysAgodate = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    const tasks = await Task.find({
      status: "Completed",
      updatedAt: { $gte: sevenDaysAgodate },
    }).populate("project team owners");
    return res.status(200).json({
      success: true,
      data: tasks,
      message: tasks.length
        ? "Task data completed in last week fetched successfully"
        : "No task completed in last week",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /report/pending : Fetch total days of work pending for all tasks. This
// can be calculated by summing the timeToComplete field of tasks that are
// not marked Completed .
const pendingReport = async (req, res) => {
  try {
    const incompletedTasks = await Task.find({
      status: { $ne: "Completed" },
    }).populate("project team owners");
    const totalDays = incompletedTasks.reduce(
      (total, task) => total + (task.timeToComplete || 0),
      0
    );
    return res.status(200).json({
      success: true,
      data: {
        incompletedTasks,
        totalDays,
      },
      message:
        totalDays === 0
          ? "Currently no tasks are pending"
          : `${totalDays} days of work pending`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//GET /report/closed-tasks : Fetch the number of tasks closed by team,
// owner, or project. This can be calculated by grouping tasks by the
// team , owner , or project and counting the tasks that have status:
// Completed .
const closedTask = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = { lastWeekReport, pendingReport };
