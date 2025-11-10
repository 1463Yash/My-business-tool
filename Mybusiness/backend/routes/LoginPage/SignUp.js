const express = require("express");
const db = require("../../db");
const router = express.Router();
const { sendOTP } = require("./OTPgenerator");
router.get("/", (req, res) => {
  const { email } = req.query;
  const sql =
    "select exists(select 1 from userinfo where email=?)AS exitsemail";
  db.query(sql, [email], (err, results) => {
    console.log("Exits mail Test 1 passed with value", results[0].exitsemail);
    
     sendOTP(email).then((OTPresults) => {
      console.log("Mail Suceess test 2 ",OTPresults.success);
      console.log("OTP test 3 ",OTPresults.OTP)
      return res.json({
        dbresults:results[0],
        OTPresults:OTPresults
      });
    });
  });
});

module.exports = router;
