const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all product codes
router.get("/", (req, res) => {
  db.query("SELECT * FROM productcode", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    console.log("Product code loaded successfully");
  });
});

// POST new product code
router.post("/", (req, res) => {
  const { code, HSN, description, vendorsname } = req.body;
  if (!code || !HSN || !description || !vendorsname) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const sql =
    "INSERT INTO productcode(code, HSN, description, vendorsname) VALUES (?, ?, ?, ?)";
  db.query(sql, [code, HSN, description, vendorsname], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Duplicate code. Already exists." });
      }
      return res.status(500).json({ message: "Failed to save productcode" });
    }
    res.status(201).json({ message: "✅ Product code saved", code });
    console.log("Product code added successfully!");
  });
});

// PUT update product code
router.put("/:code", (req, res) => {
  const { code } = req.params;
  const { HSN, description, vendorsname } = req.body;
  const sql =
    "UPDATE productcode SET HSN=?, description=?, vendorsname=? WHERE TRIM(LOWER(code)) = TRIM(LOWER(?))";
  db.query(sql, [HSN, description, vendorsname, code], (err, result) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Product updated successfully" });
    console.log("Product code updated successfully!");
  });
});

// DELETE product code
router.delete("/:code", (req, res) => {
  const { code } = req.params;
  const sql =
    "DELETE FROM productcode WHERE TRIM(LOWER(code)) = TRIM(LOWER(?))";
  db.query(sql, [code], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete product code" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Product code deleted successfully" });
    console.log("Product code deleted successfully!");
  });
});

module.exports = router;
