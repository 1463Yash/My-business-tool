const express = require("express");
const router = express.Router();
const db = require("../dbpool");


router.post("/", async (req, res) => {
  const { vendorsid, finalamount, items} = req.body;

  const connection = await db.getConnection(); 
  try {
    await connection.beginTransaction();

    // 1️⃣ Insert bill master
    const [result] = await connection.query(
      "INSERT INTO vendorsbook (vendorsid, final_amount) VALUES (?, ?)",
      [vendorsid, finalamount]
    );

    const billId = result.insertId; // ✅ Auto-generated unique bill_id

    // 2️⃣ Insert bill items (all rows share same billId)
    for (const item of items) {
      await connection.query(
  `INSERT INTO vendorsbillbook 
   (billid, productcode, name, quantity, price, discount, discounttype, gst, hsn,finaltotal) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    billId,
    item.productcode,
    item.name,
    item.quantity,
    item.price,
    item.discount,
    item.discountType,
    item.gst,
    item.hsn,
    item.finalTotal,
  ]
);

    }

    await connection.commit();
    res.json({ message: "Bill saved successfully", billId });
    console.log("Bill saved successfully!");

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Error saving bill" });
  } finally {
    connection.release();
  }
});

module.exports=router;