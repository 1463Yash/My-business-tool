const express = require("express");
const db = require("../../db");
const router = express.Router();
router.post("/",(req,res)=>{
    const {retailerid,amount,date,comments,paymentMode}=req.body;
    const sql=`INSERT INTO paymentfromretailer(retailerid,amount,date,comments,paymentMode) VALUES (?,?,?,?,?)`;
    db.query(sql,[retailerid,amount,date,comments,paymentMode],(err,results)=>{
        if(err){
            return res.status(500).json({message:"Failed to Payment in database!"});
        }
        else{
            res.status(201).json({message:"Retailers Payment has been successfully submitted."});
        }
    })

});
module.exports=router;