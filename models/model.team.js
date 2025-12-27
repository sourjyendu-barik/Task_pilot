const mongoose = require("mongoose");
// Team Schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Team names must be unique
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "At least one member is required",
    },
  },
  description: { type: String }, // Optional description forthe team
});
module.exports = mongoose.model("Team", teamSchema);
