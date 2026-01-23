const Task = require("../models/model.task");

// GET /report/last-week : Fetch tasks completed in the last week. This can
// be calculated by querying tasks where the status is Completed and
// comparing the updatedAt field to the current date minus 7 days.

const lastWeekReport = async (req, res) => {
  try {
    const currentDate = new Date();
    const sevenDaysAgodate = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000,
    );
    const count = await Task.countDocuments({
      status: "Completed",
      updatedAt: { $gte: sevenDaysAgodate },
    });
    return res.status(200).json({
      success: true,
      data: count,
      message: !!count
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
    const totalPendingTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
    });
    const totalTasks = await Task.countDocuments();
    return res.status(200).json({
      success: true,
      data: { totalPendingTasks, totalTasks },
      message: totalPendingTasks
        ? `${totalPendingTasks} tasks are pending`
        : "Currently no tasks are pending",
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
const getClosedTasksReport = async (req, res) => {
  try {
    const { groupBy } = req.query; // team | owners | project

    if (!["team", "owners", "project"].includes(groupBy)) {
      return res.status(400).json({
        success: false,
        message: "groupBy must be team, owners, or project",
      });
    }

    // populate only the required field
    const tasks = await Task.find({ status: "Completed" }).populate(groupBy);

    const groupedData = tasks.reduce((acc, task) => {
      const field = task[groupBy];

      // owners → array of users
      if (Array.isArray(field)) {
        field.forEach((item) => {
          const name = item?.name || "Unknown";
          acc[name] = (acc[name] || 0) + 1;
        });
      }
      // team / project → single object
      else if (field) {
        const name = field.name || "Unknown";
        acc[name] = (acc[name] || 0) + 1;
      }

      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: groupedData,
      message: "Closed tasks grouped by name successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { lastWeekReport, pendingReport, getClosedTasksReport };
