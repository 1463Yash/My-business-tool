const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/",async(req,res)=>{
    const sql=`SELECT p1.productcode,
	p1.hsn,p1.name,
    DATE_FORMAT(p2.latest_date,'%Y-%M-%D') AS received_date,
    p1.price AS last_price,
    (p2.buy_quantity-coalesce(sell_quantity,0)) as available_stock,
    ((p2.buy_quantity-coalesce(sell_quantity,0))*p1.price) as stock_price 
FROM vendorsbillbook p1 
JOIN (SELECT productcode, 
	MAX(bill_date) AS latest_date,
    SUM(quantity) AS buy_quantity FROM vendorsbillbook 
    GROUP BY productcode) p2 
ON p1.productcode = p2.productcode AND p1.bill_date = p2.latest_date 
LEFT JOIN ( SELECT productcode, 
	SUM(quantity) AS sell_quantity 
    FROM retailersbillbook 
    GROUP BY productcode)
r ON p1.productcode = r.productcode`;
    db.query(sql,(err,results)=>{
        if(err)return res.status(500).json({message:"Server error!"});
        res.json(results);
        console.log("Inventory loaded successfully.");
    });

});
module.exports=router;