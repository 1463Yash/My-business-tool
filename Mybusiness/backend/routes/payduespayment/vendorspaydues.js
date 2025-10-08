 const express = require("express");
const db = require("../../db");
const router = express.Router();

router.post("/", (req, res) => {
  const { vendorid, amount, date, comments, paymentMode } = req.body;
  const sql = `INSERT INTO paymentfromvendor(vendorid, amount, date, comments, paymentMode) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [vendorid, amount, date, comments, paymentMode], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to record payment in database!" });
    } else {
      res.status(201).json({ message: "Vendor payment has been successfully submitted." });
    }
  });
});

module.exports = router;
