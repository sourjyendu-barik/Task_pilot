const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's name
  email: { type: String, required: true, unique: true }, // Email must be unique
  password: { type: String, required: true, select: false }, // when fetching data it will not return
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
