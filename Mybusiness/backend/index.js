const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abc@1463",
  database: "mybusiness",
});

// Connect to MySQL
db.connect((err) => {
  if (err) return console.error("MySQL connection error:", err.message);
  console.log("✅ MySQL connected.");
});

// Root endpoint
app.get("/", (req, res) => res.send("Server is working!"));

// =================== VENDORS =================== //

// GET all vendors
app.get("/api/vendors", (req, res) => {
  db.query("SELECT * FROM vendors", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    console.log("✅ Vendors data loaded successfully!");
  });
});

// POST new vendor
app.post("/api/vendors", (req, res) => {
  const { name, gstNumber, bankName, accountNumber, ifscCode } = req.body;
  const sql =
    "INSERT INTO vendors (name, gstNumber, bankName, accountNumber, ifscCode) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, gstNumber, bankName, accountNumber, ifscCode],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, ...req.body });
      console.log("✅ Vendor added successfully!");
    }
  );
});

// PUT update vendor
app.put("/api/vendors/:id", (req, res) => {
  const { id } = req.params;
  const { name, gstNumber, bankName, accountNumber, ifscCode } = req.body;
  const sql =
    "UPDATE vendors SET name=?, gstNumber=?, bankName=?, accountNumber=?, ifscCode=? WHERE id=?";
  db.query(
    sql,
    [name, gstNumber, bankName, accountNumber, ifscCode, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Vendor updated" });
      console.log(`✅ Vendor updated successfully! (ID: ${id})`);
    }
  );
});

// DELETE vendor
app.delete("/api/vendors/:id", (req, res) => {
  db.query("DELETE FROM vendors WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Vendor deleted" });
    console.log(`✅ Vendor deleted successfully! (ID: ${req.params.id})`);
  });
});

// =================== RETAILERS =================== //

// =================== RETAILERS =================== //

// GET all retailers
app.get("/retailers", (req, res) => {
  db.query("SELECT * FROM retailers", (err, results) => {
    if (err) {
      console.error("Error fetching retailers:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
    console.log("✅ Retailers data loaded successfully!");
  });
});

// POST new retailer
app.post("/retailers", (req, res) => {
  const { name, address, contactNumber } = req.body;

  if (!name || !address || !contactNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "INSERT INTO retailers (name, address, contactNumber) VALUES (?, ?, ?)";
  db.query(sql, [name, address, contactNumber], (err, result) => {
    if (err) {
      console.error("Error inserting retailer:", err);
      return res.status(500).json({ message: "Failed to save retailer" });
    }

    res.status(201).json({ id: result.insertId, name, address, contactNumber });
    console.log("✅ Retailer added successfully!");
  });
});

// PUT update retailer
app.put("/retailers/:id", (req, res) => {
  const { id } = req.params;
  const { name, address, contactNumber } = req.body;

  const sql =
    "UPDATE retailers SET name=?, address=?, contactNumber=? WHERE id=?";
  db.query(sql, [name, address, contactNumber, id], (err) => {
    if (err) {
      console.error("Error updating retailer:", err);
      return res.status(500).json({ message: "Failed to update retailer" });
    }

    res.json({ message: "Retailer updated" });
    console.log(`✅ Retailer updated successfully! (ID: ${id})`);
  });
});

// DELETE retailer
app.delete("/retailers/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM retailers WHERE id=?", [id], (err) => {
    if (err) {
      console.error("Error deleting retailer:", err);
      return res.status(500).json({ message: "Failed to delete retailer" });
    }

    res.json({ message: "Retailer deleted" });
    console.log(`✅ Retailer deleted successfully! (ID: ${id})`);
  });
});

// GET all product codes
app.get("/api/addproductcode", (req, res) => {
  db.query("SELECT * FROM productcode", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    console.log("✅ Product code data loaded successfully!");
  });
});

// POST new product code
app.post("/api/addproductcode", (req, res) => {
  const { code, HSN, description, vendorsname } = req.body;
  const query =
    "INSERT INTO productcode(code, HSN, description,vendorsname) VALUES (?, ?, ?,?)";
  db.query(query, [code, HSN, description, vendorsname], (err, result) => {
    if (err) {
      console.error("Error inserting productcode:", err);
      return res.status(500).json({ message: "Failed to save productcode" });
    }
    res.status(201).json({ message: "Product code saved", code });
    console.log("✅ Product code added successfully!");
  });
});

// PUT update product code
// ✅ Update Product Code
app.put("/api/addproductcode/:code", (req, res) => {
  const { code } = req.params;
  const { HSN, description, vendorsname } = req.body;

  const sql ="UPDATE productcode SET HSN = ?, description = ?, vendorsname = ? WHERE code = ?";
  db.query(sql, [HSN, description, vendorsname, code], (err, result) => {
    if (err) {
      console.error("Error updating product code:", err);
      return res.status(500).json({ error: "Update failed" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product code not found" });
    }
    res.json({ message: "Product updated successfully" });
  });
});

// DELETE product code
app.delete("/api/addproductcode/:code", (req, res) => {
  const { code } = req.params;
  db.query("DELETE FROM productcode WHERE code=?", [code], (err) => {
    if (err) {
      console.error("Error deleting product code:", err);
      return res.status(500).json({ message: "Failed to delete product code" });
    }
    res.json({ message: "Product code deleted" });
    console.log(`✅ Product code deleted successfully! (Code: ${code})`);
  });
});

// =================== SERVER =================== //
app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
