const  nodemailer=require("nodemailer");

const OTP=Math.floor(100000+Math.random()*900000);
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        
    }
})