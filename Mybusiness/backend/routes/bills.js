const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all bills (with filters)
router.get("/", (req, res) => {
  const { retailerId, status, startDate, endDate } = req.query;
  let sql = "SELECT * FROM bills WHERE 1=1";
  const params = [];

  if (retailerId) {
    sql += " AND retailerId = ?";
    params.push(retailerId);
  }
  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }
  if (startDate && endDate) {
    sql += " AND date BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// POST new bill
router.post("/", (req, res) => {
  const { retailerId, amount, date } = req.body;
  if (!retailerId || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const sql =
    "INSERT INTO bills (retailerId, amount, date, status) VALUES (?, ?, ?, 'Pending')";
  db.query(sql, [retailerId, amount, date], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res
      .status(201)
      .json({ message: "Bill submitted successfully", id: result.insertId });
  });
});

// PUT clear/deduct bill amount
router.put("/clear/:id", (req, res) => {
  const { id } = req.params;
  const { clearedAmount } = req.body;
  const sql = `
    UPDATE bills
    SET amount = amount - ?, 
        status = CASE WHEN amount - ? <= 0 THEN 'Paid' ELSE 'Partial' END
    WHERE id = ?
  `;
  db.query(sql, [clearedAmount, clearedAmount, id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Bill updated successfully" });
  });
});

// DELETE bill
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM bills WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Bill deleted successfully" });
  });
});

module.exports = router;
