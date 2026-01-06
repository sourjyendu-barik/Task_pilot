const mongoose = require("mongoose");
// Task Schema
const taskSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Project is required"],
  }, // Refers to Project model
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: [true, "Team is required"],
  }, // Refers to Team model
  owners: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "At least one owner is required",
    },
  },

  tags: [{ type: String }], // Array of tags
  timeToComplete: {
    type: Number,

    required: [true, "Time in number of days is required"],
  }, // Number of days to complete the task
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed", "Blocked"],
    // Enum for task status
    default: "To Do",
  }, // Task status
  dueDate: { type: Date, required: [true, "Due date is required."] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
// Automatically update the `updatedAt` field whenever the document is updated
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("Task", taskSchema);
