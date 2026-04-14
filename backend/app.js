const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const notesRouter = require("./routes/notes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/notes", notesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  res.status(500).json({ error: "Internal server error", details: error.message });
});

module.exports = app;
