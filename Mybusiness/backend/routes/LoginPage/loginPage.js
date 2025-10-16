const express=require('express');
const db=require("../../db");
const router=express.Router();

router.get("/",(req,res)=>{
    const {email}=req.query;
    const sql= "select exists(select 1 from userinfo where email=?)AS exitsemail";
    db.query(sql,[email],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        return res.json(results);
            // const exists = results[0].exitsemail === 1;
            // return res.json({ exists });
        
    })
});
module.exports=router;