const express = require("express");
const cors = require("cors");

const vendorsRoutes = require("./routes/vendors");
const retailersRoutes = require("./routes/retailers");
const productCodesRoutes = require("./routes/productCodes");



const app = express();
app.use(cors());
app.use(express.json());
// Root endpoint
app.get("/", (req, res) => res.send("✅ Server is working!"));

// Mount routes
app.use("/api/vendors", vendorsRoutes);
app.use("/retailers", retailersRoutes);
app.use("/api/addproductcode", productCodesRoutes);


// Server start
app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
