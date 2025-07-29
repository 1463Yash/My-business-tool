 import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const BASE_URL = "http://localhost:3000";

export default function Retailers() {
  const [retailers, setRetailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNumber: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/retailers`);
      setRetailers(res.data);
    } catch (err) {
      console.error("Error fetching retailers:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleAddOrUpdate = async () => {
    if (form.name.trim() === "") return;
     const duplicate = retailers.some(
      (v) =>
        v.name.toLowerCase() === form.name.trim().toLowerCase() &&
        v.id !== editingId
    );
    if (duplicate) {
      alert("retailer with this name already exists.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/retailers/${editingId}`, form);
      } else {
        await axios.post(`${BASE_URL}/retailers`, form);
      }

      await fetchRetailers();
      setForm({ name: "", address: "", contactNumber: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving retailer:", err);
      alert("Failed to save retailer");
    }
  };

  const handleDelete = async (id) => {
    const confirm = prompt("Type 'yes' to delete this retailer.");
    if (confirm?.toLowerCase() === "yes") {
      try {
        await axios.delete(`${BASE_URL}/retailers/${id}`);
        await fetchRetailers();
      } catch (err) {
        console.error("Error deleting retailer:", err);
        alert("Failed to delete");
      }
    }
  };

  const handleEdit = (retailer) => {
    setForm(retailer);
    setEditingId(retailer.id);
  };

  const handleExport = () => {
    const exportData = retailers.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Retailers");
    XLSX.writeFile(wb, "retailers.xlsx");
  };

  const filteredRetailers = retailers.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.address && r.address.toLowerCase().includes(q)) ||
      (r.contactNumber && r.contactNumber.includes(q))
    );
  });

  return (
    <div className="main-content">
      <h2>Retailers</h2>

      {/* Search + Export */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search retailers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ flex: 1, maxWidth: 250 }}
        />
        <button onClick={handleExport} className="add-btn" style={{ marginLeft: "auto" }}>
          Export to Excel
        </button>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <input name="name" placeholder="Retailer Name *" value={form.name} onChange={handleChange} className="input-field" />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input-field" />
        <input name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} className="input-field" />
        <button onClick={handleAddOrUpdate} className="add-btn">
          {editingId ? "Update Retailer" : "Add Retailer"}
        </button>
      </div>

      {/* Table */}
      {filteredRetailers.length > 0 ? (
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRetailers.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.address || "—"}</td>
                <td>{r.contactNumber || "—"}</td>
                <td>
                  <button className="delete-icon-btn" onClick={() => handleEdit(r)}>Edit</button>
                  <button className="delete-icon-btn" onClick={() => handleDelete(r.id)} style={{ marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No retailers found.</p>
      )}
    </div>
  );
}
