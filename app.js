//impporting libraries
const express = require("express");
const cors = require("cors");
const auth = require("./middlewire/auth");

//creating express app instance
const app = express();

//middlewere setup
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

//roures registartion

//un protected routes
app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/data.routes"));

//protected routes
app.use(auth);
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/team.routes"));
app.use("/api", require("./routes/project.routes"));
app.use("/api", require("./routes/tag.routes"));
app.use("/api", require("./routes/task.routes"));
app.use("/api", require("./routes/report.routes"));

module.exports = app;
