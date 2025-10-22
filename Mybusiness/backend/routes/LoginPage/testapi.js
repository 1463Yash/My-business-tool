const OTP=Math.floor(100000+Math.random()*900000);
console.log(OTP);
const currenttime=Date.now();
console.log("Current time ",currenttime)
console.log("This OTP will expire after 2mins.On that time");
const expiretime=Date.now()+2*60*1000;
console.log(expiretime);
console.log(expiretime-currenttime);