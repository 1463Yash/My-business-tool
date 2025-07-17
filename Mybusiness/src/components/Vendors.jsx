 import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    gstNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: ""
  });
  /////////
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vendors")) || [];
    setVendors(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }, [vendors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVendor = () => {
    if (form.name.trim() === "") return;

    const exists = vendors.some(
      (v) =>
        v.name.toLowerCase() === form.name.trim().toLowerCase() &&
        v.id !== editingId
    );
    if (exists) {
      alert("Vendor with this name already exists.");
      return;
    }

    if (editingId !== null) {
      const updated = vendors.map((v) =>
        v.id === editingId ? { ...form, id: editingId, totalPurchase: v.totalPurchase || 0 } : v
      );
      setVendors(updated);
      setEditingId(null);
    } else {
      const newVendor = {
        ...form,
        id: Date.now(),
        totalPurchase: 0
      };
      setVendors([...vendors, newVendor]);
    }

    setForm({
      name: "",
      gstNumber: "",
      bankName: "",
      accountNumber: "",
      ifscCode: ""
    });
  };

  const handleDelete = (id) => {
    const confirm = prompt("Are you sure? Type 'yes' to delete this vendor.");
    if (confirm && confirm.toLowerCase() === "yes") {
      setVendors(vendors.filter((v) => v.id !== id));
    }
  };

  const handleEdit = (id) => {
    const toEdit = vendors.find((v) => v.id === id);
    if (toEdit) {
      setForm(toEdit);
      setEditingId(id);
    }
  };

  const handleExport = () => {
    const exportData = vendors.map(({ id, totalPurchase, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, "vendors.xlsx");
  };

  const filteredVendors = vendors.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(query) ||
      v.gstNumber.toLowerCase().includes(query)
    );
  });

  return (
    <div className="main-content">
      <h2>Vendors</h2>
      <p>Add, update, and export vendors with GST and bank details.</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search vendors..."
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
        <input name="name" placeholder="Vendor Name *" value={form.name} onChange={handleChange} className="input-field" />
        <input name="gstNumber" placeholder="GST Number" value={form.gstNumber} onChange={handleChange} className="input-field" />
        <input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} className="input-field" />
        <input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} className="input-field" />
        <input name="ifscCode" placeholder="IFSC Code" value={form.ifscCode} onChange={handleChange} className="input-field" />
        <button onClick={handleAddVendor} className="add-btn">
          {editingId ? "Update Vendor" : "Add Vendor"}
        </button>
      </div>

      {filteredVendors.length > 0 ? (
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>GST</th>
              <th>Bank</th>
              <th>Account</th>
              <th>IFSC</th>
              <th>Total Purchase (₹)</th>
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
                <td>₹ {(v.totalPurchase || 0).toFixed(2)}</td>
                <td>
                  <button className="delete-icon-btn" onClick={() => handleEdit(v.id)}>Edit</button>
                  <button className="delete-icon-btn" onClick={() => handleDelete(v.id)} style={{ marginLeft: "6px" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vendors found.</p>
      )}
    </div>
  );
}
