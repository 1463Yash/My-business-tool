 import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function Retailers() {
  const [retailers, setRetailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    gstNumber: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("retailers")) || [];
    setRetailers(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("retailers", JSON.stringify(retailers));
  }, [retailers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRetailer = () => {
    if (form.name.trim() === "") return;

    const exists = retailers.some(
      (r) =>
        r.name.toLowerCase() === form.name.trim().toLowerCase() &&
        r.id !== editingId
    );
    if (exists) {
      alert("Retailer with this name already exists.");
      return;
    }

    if (editingId !== null) {
      const updated = retailers.map((r) =>
        r.id === editingId
          ? { ...form, id: editingId, totalPurchase: r.totalPurchase || 0 }
          : r
      );
      setRetailers(updated);
      setEditingId(null);
    } else {
      const newRetailer = {
        ...form,
        id: Date.now(),
        totalPurchase: 0
      };
      setRetailers([...retailers, newRetailer]);
    }

    setForm({
      name: "",
      address: "",
      contactNumber: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      gstNumber: ""
    });
  };

  const handleDelete = (id) => {
    const confirm = prompt("Are you sure? Type 'yes' to delete this retailer.");
    if (confirm && confirm.toLowerCase() === "yes") {
      setRetailers(retailers.filter((r) => r.id !== id));
    }
  };

  const handleEdit = (id) => {
    const toEdit = retailers.find((r) => r.id === id);
    if (toEdit) {
      setForm(toEdit);
      setEditingId(id);
    }
  };

  const handleExport = () => {
    const exportData = retailers.map(({ id, totalPurchase, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Retailers");
    XLSX.writeFile(wb, "retailers.xlsx");
  };

  const filteredRetailers = retailers.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(query) ||
      r.address.toLowerCase().includes(query) ||
      (r.contactNumber && r.contactNumber.includes(query))
    );
  });

  return (
    <div className="main-content">
      <h2>Retailers</h2>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search retailers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ flex: 1, maxWidth: "250px" }}
        />
        <button onClick={handleExport} className="add-btn" style={{ marginLeft: "auto" }}>
          Update to Excel
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <input name="name" placeholder="Retailer Name *" value={form.name} onChange={handleChange} className="input-field" />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input-field" />
        <input name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} className="input-field" />
        <input name="gstNumber" placeholder="GST Number" value={form.gstNumber} onChange={handleChange} className="input-field" />
        <input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} className="input-field" />
        <input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} className="input-field" />
        <input name="ifscCode" placeholder="IFSC Code" value={form.ifscCode} onChange={handleChange} className="input-field" />
        <button onClick={handleAddRetailer} className="add-btn">
          {editingId ? "Update Retailer" : "Add Retailer"}
        </button>
      </div>

      {filteredRetailers.length > 0 ? (
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>GST</th>
              <th>Bank</th>
              <th>Account</th>
              <th>IFSC</th>
              <th>Total Purchase (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRetailers.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.address || "—"}</td>
                <td>{r.contactNumber || "—"}</td>
                <td>{r.gstNumber || "—"}</td>
                <td>{r.bankName || "—"}</td>
                <td>{r.accountNumber || "—"}</td>
                <td>{r.ifscCode || "—"}</td>
                <td>₹ {(r.totalPurchase || 0).toFixed(2)}</td>
                <td>
                  <button className="delete-icon-btn" onClick={() => handleEdit(r.id)}>Edit</button>
                  <button className="delete-icon-btn" onClick={() => handleDelete(r.id)} style={{ marginLeft: "6px" }}>Delete</button>
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
