import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
export default function Inventory() {
  const [inventory, setinventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetchInventory();
  }, []);
  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:3000/inventory");
      setinventory(res.data);
    } catch (err) {
      console.log("Error in fetching inventory data", err);
    }
  };

  const filteredInventory = inventory.filter((r) => {
    const q = searchQuery.toLowerCase();
    return r.name.toLowerCase().includes(q);
  });

  
    // ----------------- EXPORT TO EXCEL -----------------
    const handleExport = () => {
      const exportData = inventory.map(({ id, ...rest }) => rest);
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "inventory");
      XLSX.writeFile(wb, "Inventory.xlsx");
    };
  

  const totalStockPrice = filteredInventory.reduce(
  (sum, r) => sum + Number(r.stock_price || 0), 
  0
);

  return (
    <div>
      <h2>Inventory</h2>
      <p>Manage and track your stock.</p>
      
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search product"
          onChange={(e)=>setSearchQuery(e.target.value)}
          className="input-field"
          style={{ maxWidth: "250px" }}
        />
        <button className="add-btn" onClick={handleExport}>Export to Excel</button>
      </div>
      <div style={{fontSize:"large", marginRight:"100px" ,textAlign:"right"}}><b>Total Stock Price:{Number(totalStockPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></div>
      {/* Table*/}
      <div className="table-container">
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>HSN</th>
              <th>latest Unit price</th>
              <th>Available Stock</th>
              <th>Stock recieved At</th>
              <th>Stock price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((r) => {
              return (
                <tr key={r.productcode}>
                  <td>{r.productcode}</td>
                  <td>{r.name}</td>
                  <td>{r.hsn}</td>
                  <td>₹{r.last_price}</td>
                  <td>{r.available_stock}</td>
                  <td>{r.received_date}</td>
                  <td><b>₹{Number(r.stock_price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
