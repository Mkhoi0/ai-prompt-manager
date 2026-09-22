// routes/prompts.js — CRUD for AI prompts, scoped to the logged-in user
const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/prompts?search=&tag=
router.get("/", (req, res) => {
  const { search, tag } = req.query;
  let query = "SELECT * FROM prompts WHERE user_id = ?";
  const params = [req.userId];

  if (search) {
    query += " AND (title LIKE ? OR content LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (tag) {
    query += " AND tags LIKE ?";
    params.push(`%${tag}%`);
  }
  query += " ORDER BY updated_at DESC";

  const prompts = db.prepare(query).all(...params);
  res.json(prompts);
});

// GET /api/prompts/:id
router.get("/:id", (req, res) => {
  const prompt = db
    .prepare("SELECT * FROM prompts WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!prompt) return res.status(404).json({ error: "Prompt not found" });
  res.json(prompt);
});

// POST /api/prompts
router.post("/", (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const result = db
    .prepare("INSERT INTO prompts (user_id, title, content, tags) VALUES (?, ?, ?, ?)")
    .run(req.userId, title, content, tags || "");

  const created = db.prepare("SELECT * FROM prompts WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/prompts/:id
router.put("/:id", (req, res) => {
  const { title, content, tags } = req.body;
  const existing = db
    .prepare("SELECT * FROM prompts WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: "Prompt not found" });

  db.prepare(
    "UPDATE prompts SET title = ?, content = ?, tags = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title ?? existing.title, content ?? existing.content, tags ?? existing.tags, req.params.id);

  const updated = db.prepare("SELECT * FROM prompts WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// DELETE /api/prompts/:id
router.delete("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT * FROM prompts WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: "Prompt not found" });

  db.prepare("DELETE FROM prompts WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
