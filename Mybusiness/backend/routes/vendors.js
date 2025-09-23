const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all vendors
router.get("/", (req, res) => {
  db.query("SELECT v.id,v.name,v.gstNumber,v.bankName,v.accountNumber,v.ifscCode,IFNULL(SUM(vb.final_amount), 0) AS total_dues FROM vendors v LEFT JOIN vendorsbook vb  ON v.id = vb.vendorsid GROUP BY v.id", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    console.log("Vendors loaded successfully!");
  });
});

// POST new vendor
router.post("/", (req, res) => {
  const { name, gstNumber, bankName, accountNumber, ifscCode } = req.body;
  const sql =
    "INSERT INTO vendors (name, gstNumber, bankName, accountNumber, ifscCode) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, gstNumber, bankName, accountNumber, ifscCode],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, ...req.body });
      console.log("Vendors added successfully!");
    }
  );
});

// PUT update vendor
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, gstNumber, bankName, accountNumber, ifscCode } = req.body;
  const sql =
    "UPDATE vendors SET name=?, gstNumber=?, bankName=?, accountNumber=?, ifscCode=? WHERE id=?";
  db.query(sql, [name, gstNumber, bankName, accountNumber, ifscCode, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Vendor updated" });
    console.log("vendors updated successfully!");
  });
});

// DELETE vendor
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM vendors WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Vendor deleted" });
    console.log("vendors deleted successfully!");
  });
});

module.exports = router;
