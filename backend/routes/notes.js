const express = require("express");
const { all, get, run } = require("../db");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const notes = await all("SELECT id, title, content FROM notes ORDER BY id DESC");
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title = "", content = "" } = req.body;
    const result = await run("INSERT INTO notes (title, content) VALUES (?, ?)", [title, content]);
    const createdNote = await get("SELECT id, title, content FROM notes WHERE id = ?", [result.id]);
    res.status(201).json(createdNote);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title = "", content = "" } = req.body;
    const result = await run("UPDATE notes SET title = ?, content = ? WHERE id = ?", [title, content, id]);

    if (result.changes === 0) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    const updatedNote = await get("SELECT id, title, content FROM notes WHERE id = ?", [id]);
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await run("DELETE FROM notes WHERE id = ?", [id]);

    if (result.changes === 0) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
