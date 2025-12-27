//impporting libraries
const express = require("express");
const cors = require("cors");

//creating express app instance
const app = express();

//middlewere setup
app.use(express.json());
app.use(cors());

//roures registartion
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/team.routes"));

module.exports = app;
