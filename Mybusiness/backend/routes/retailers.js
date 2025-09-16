const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all retailers with dues
router.get("/", (req, res) => {
  const sql="select *from retailers";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results);
    console.log("Retalier loaded successfully!");
    
  });
  });


// POST new retailer
router.post("/", (req, res) => {
  const { name, address, contactNumber } = req.body;
  if (!name || !address || !contactNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const sql =
    "INSERT INTO retailers (name, address, contactNumber) VALUES (?, ?, ?)";
  db.query(sql, [name, address, contactNumber], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to save retailer" });
    res.status(201).json({ id: result.insertId, name, address, contactNumber });
    console.log("Retalier added successfully!");
  });
  });


// PUT update retailer
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, address, contactNumber, dues } = req.body;
  const sql =
    "UPDATE retailers SET name=?, address=?, contactNumber=?, dues=? WHERE id=?";
  db.query(sql, [name, address, contactNumber, dues || 0, id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to update retailer" });
    res.json({ message: "Retailer updated" });
    console.log("Retalier Updated successfully!");
  });
  });


// DELETE retailer
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM retailers WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete retailer" });
    res.json({ message: "Retailer deleted" });
    console.log("Retalier deleted successfully!");
  });
});

module.exports = router;
