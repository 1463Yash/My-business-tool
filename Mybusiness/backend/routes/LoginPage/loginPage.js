const express = require("express");
const db = require("../../db");
const router = express.Router();
const { sendOTP } = require("./OTPgenerator");
router.get("/", (req, res) => {
  const { email } = req.query;
  console.log(email);
  const sql =
    "select exists(select 1 from userinfo where email=?)AS exitsemail";
  db.query(sql, [email], (err, results) => {
    try {
      res.json(results);
      if (results[0].exitsmail == 0) {
        sendOTP(email).then((results) => {
            if(results.success){
              console.log("Email sent suuccessfully!");
                return res.json(results);
            }
            else{
                console.log(results);
            } 
        });
      }
    } catch (err) {
      console.log("Error in getting email", err);
    }
  });
});


module.exports = router;