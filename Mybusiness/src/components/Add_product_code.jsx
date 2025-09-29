// Add_product_code.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Add_product_code() {
  const [productcode, setCode] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendors, setVendors] = useState([]);
  const[stockCode,setStockecode]=useState([]);
  const [form, setForm] = useState({
    code: "",
    HSN: "",
    description: "",
    vendorsname: "",
  });
  const [editingCode, setEditingCode] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchVendors();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/addproductcode");
      setCode(res.data);
    } catch (err) {
      console.error("Error fetching product code:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleAddOrUpdate = async () => {
  if (form.code.trim() === "") return;

  try {
    if (editingCode !== null) {
      await axios.put(
        `http://localhost:3000/api/addproductcode/${editingCode}`,
        {
          HSN: form.HSN,
          description: form.description,
          vendorsname: form.vendorsname,
        }
      );
    } else {
      await axios.post("http://localhost:3000/api/addproductcode", form);
    }

    setForm({ code: "", HSN: "", description: "", vendorsname: "" });
    setEditingCode(null);
    fetchProducts();
  } catch (err) {
  if (err.response) {
    if (err.response.status === 409) {
      alert("❌ Duplicate code! This product code already exists.");
    } else if (err.response.status === 400) {
      alert("⚠ All fields are required.");
    } else {
      alert("Something went wrong while saving. Try again.");
    }
    console.log("Handled error:", err.response.data.message);
  } else {
    alert("Network error. Check your server.");
    console.log("Handled error:", err.message);
  }
}

};
  
  useEffect(()=>{
    const fetchStockecode=async()=>{
      try{
        const res=await axios.get("http://localhost:3000/retailer-billing");
        setStockecode(res.data);
      }
      catch(err){
        console.error("Error in fetching deletcode");
      }
    };
    fetchStockecode();
  },[]);

  const handleDelete = async (code) => {
    const selectedProduct = stockCode.find(
    (p) => p.productcode === code
  );

  // Check stock availability before deleting
  if (selectedProduct && selectedProduct.available_stock > 0) {
    return alert(`Product is in stock. Cannot delete it!`);
  }

    const confirmDelete = prompt(
      "Are you sure? Type 'yes' to delete this product code."
    );
    if (confirmDelete?.toLowerCase() === "yes") {
      try {
        await axios.delete(`http://localhost:3000/api/addproductcode/${code}`);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product code:", err);
        alert("Failed to delete. Please try again.");
      }
    }
  };

  const handleEdit = (item) => {
    setForm({
      code: item.code,
      HSN: item.HSN,
      description: item.description,
      vendorsname: item.vendorsname,
    });
    setEditingCode(item.code);
  };

  const handleExport = () => {
    const exportData = productcode.map(({ code, HSN, description }) => ({
      code,
      HSN,
      description,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product Code");
    XLSX.writeFile(wb, "productcode.xlsx");
  };

  const filteredProductcode = productcode.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      (v.code && v.code.toLowerCase().includes(query)) ||
      (v.HSN && v.HSN.toLowerCase().includes(query))
    );
  });
  const fetchVendors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };
  return (
    <div className="main-content">
      <h2>Add Product Code</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search product code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ maxWidth: "250px" }}
        />
        <button onClick={handleExport} className="add-btn">
          Export to Excel
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          name="code"
          placeholder="Product Code*"
          value={form.code}
          onChange={handleChange}
          className="input-field"
          required
          disabled={editingCode !== null} // prevent editing primary key
        />
        <input
          name="HSN"
          placeholder="HSN*"
          value={form.HSN}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          name="description"
          placeholder="Product Details*"
          value={form.description}
          onChange={handleChange}
          className="input-field"
          required
        />
        <select
          name="vendorsname"
          value={form.vendorsname || ""}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select Vendor</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddOrUpdate} className="add-btn">
          {editingCode ? "Update Product" : "Add Product"}
        </button>
        {editingCode && (
          <button
            className="add-btn"
            style={{ backgroundColor: "gray", marginLeft: "10px" }}
            onClick={() => {
              setForm({ code: "", HSN: "", description: "",vendorsname:"" });
              setEditingCode(null);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {filteredProductcode.length > 0 ? (
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>HSN</th>
              <th>Product Description</th>
              <th>vendor name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductcode.map((v) => (
              <tr key={v.code}>
                <td>{v.code}</td>
                <td>{v.HSN || "—"}</td>
                <td>{v.description || "—"}</td>
                <td>{v.vendorsname || "—"}</td>
                <td>
                  <button
                    className="delete-icon-btn"
                    onClick={() => handleEdit(v)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-icon-btn"
                    onClick={() => handleDelete(v.code)}
                    style={{ marginLeft: "6px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No product code found.</p>
      )}
    </div>
  );
}
