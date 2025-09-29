const express = require("express");
const cors = require("cors");

const vendorsRoutes = require("./routes/vendors");
const retailersRoutes = require("./routes/retailers");
const productCodesRoutes = require("./routes/productCodes");
const retailerbillRoutes=require("./routes/retailer-bill");
const vendorsbillRoutes=require("./routes/vendors-billing");
const inventoryRoutes=require("./routes/inventory");

const app = express();
app.use(cors());
app.use(express.json());
// Root endpoint
app.get("/", (req, res) => res.send("✅ Server is working!"));

// Mount routes
app.use("/api/vendors", vendorsRoutes);
app.use("/retailers", retailersRoutes);
app.use("/api/addproductcode", productCodesRoutes);
app.use("/retailer-billing",retailerbillRoutes);
app.use("/vendor-billing",vendorsbillRoutes);
app.use("/inventory",inventoryRoutes);
// Server start
app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
