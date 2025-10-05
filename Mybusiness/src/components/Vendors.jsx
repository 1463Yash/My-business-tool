 import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    gstNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    
  });
  ///////////////////////////////////////////////////////
  const [editingId, setEditingId] = useState(null);

  // Fetch vendors from backend
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleAddOrUpdate = async () => {
    const name=form.name.trim();
    if (!name) return;

    const duplicate = vendors.some(
      (v) =>
        v.name.trim().toUpperCase() === form.name.trim().toUpperCase() &&
        v.id !== editingId
    );
    if (duplicate) {
      alert("Vendor with this name already exists.");
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put(`http://localhost:3000/api/vendors/${editingId}`, form);
      } else {
        await axios.post("http://localhost:3000/api/vendors", form);
      }
      setForm({
        name: "",
        gstNumber: "",
        bankName: "",
        accountNumber: "",
        ifscCode: ""
      });
      setEditingId(null);
      fetchVendors();
    } catch (err) {
      console.error("Error saving vendor:", err);
    }
  };

  const handleDelete = async (id) => {

    const vendorsid=vendors.find(
      (v)=>v.id===id
    );

    //check total dues before closing account
    if(vendorsid && vendorsid.total_dues>0){
      return alert(`Cannot close this account, First clear all dues!`);
    }

    const confirm = prompt("Are you sure? Type 'yes' to delete this vendor.");
    if (confirm?.toLowerCase() === "yes") {
      try {
        await axios.delete(`http://localhost:3000/api/vendors/${id}`);
        fetchVendors();
      } catch (err) {
        console.error("Error deleting vendor:", err);
      }
    }
  };

  const handleEdit = (vendor) => {
    setForm(vendor);
    setEditingId(vendor.id);
  };

  const handleExport = () => {
    const exportData = vendors.map(({ totalPurchase, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, "vendors.xlsx");
  };

  const filteredVendors = vendors.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(query) ||
      v.gstNumber?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="main-content">
      <h2>Vendors</h2>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ maxWidth: "250px" }}
        />
        <button onClick={handleExport} className="add-btn">Export to Excel</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        <input name="name" placeholder="Vendor Name *" value={form.name} onChange={handleChange} className="input-field" />
        <input name="gstNumber" placeholder="GST Number" value={form.gstNumber} onChange={handleChange} className="input-field" />
        <input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} className="input-field" />
        <input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} className="input-field" />
        <input name="ifscCode" placeholder="IFSC Code" value={form.ifscCode} onChange={handleChange} className="input-field" />
        <button onClick={handleAddOrUpdate} className="add-btn">
          {editingId ? "Update Vendor" : "Add Vendor"}
        </button>
        {editingId && (
          <button
          className="add-btn"
          style={{backgroundColor:"grey",marginLeft:"10px"}}
          onClick={()=>{
            setForm({name:"",gstNumber:"",bankName:"",accountNumber:"",ifscCode:""})
            setEditingId(null);
          }}
          >
          Cancel
        </button>)}
      </div>
      <div className="table-container">
        {filteredVendors.length > 0 ? (
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>GST Number</th>
              <th>Bank</th>
              <th>Account No.</th>
              <th>IFSC</th>
              <th>Amount due</th>
              <th>Pay dues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.gstNumber || "—"}</td>
                <td>{v.bankName || "—"}</td>
                <td>{v.accountNumber || "—"}</td>
                <td>{v.ifscCode || "—"}</td>
                <td><b>₹{Number(v.total_dues).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}) || 0}</b></td>
                <td><button className="delete-icon-btn">Pay dues</button></td>
                <td>
                  <button className="delete-icon-btn" onClick={() => handleEdit(v)}>Edit</button>
                  <button className="delete-icon-btn" onClick={() => handleDelete(v.id)} style={{ marginLeft: "6px" }}>Close Account</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vendors found.</p>
      )}
      </div>
      
    </div>
  );
}
