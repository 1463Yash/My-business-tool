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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchRetailers();
  }, []);

  // ----------------- FETCH RETAILERS WITH BILLS -----------------
  const fetchRetailers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/retailers`);
      const retailersWithBills = await Promise.all(
        res.data.map(async (r) => {
          const billsRes = await axios.get(
            `${BASE_URL}/bills?retailerId=${r.id}`
          );
          const allBills = billsRes.data || [];
          const unpaidBills = allBills.filter((b) => b.status !== "Paid");
          const totalDues = unpaidBills.reduce((sum, b) => sum + b.amount, 0);
          return { ...r, totalDue: totalDues, allBills, unpaidBills };
        })
      );
      setRetailers(retailersWithBills);
    } catch (err) {
      console.error("Error fetching retailers:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  // ----------------- ADD / UPDATE RETAILER -----------------
  const handleAddOrUpdate = async () => {
    if (!form.name.trim()) return;

    const duplicate = retailers.some(
      (r) =>
        r.name.toLowerCase() === form.name.trim().toLowerCase() &&
        r.id !== editingId
    );
    if (duplicate) return alert("Retailer with this name already exists.");

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/retailers/${editingId}`, form);
      } else {
        await axios.post(`${BASE_URL}/retailers`, form);
      }
      setForm({ name: "", address: "", contactNumber: "" });
      setEditingId(null);
      fetchRetailers();
    } catch (err) {
      console.error("Error saving retailer:", err);
      alert("Failed to save retailer");
    }
  };

  // ----------------- DELETE RETAILER -----------------
  const handleDelete = async (id) => {
    const confirm = prompt("Type 'yes' to delete this retailer.");
    if (confirm?.toLowerCase() === "yes") {
      try {
        await axios.delete(`${BASE_URL}/retailers/${id}`);
        fetchRetailers();
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

  // ----------------- EXPORT TO EXCEL -----------------
  const handleExport = () => {
    const exportData = retailers.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Retailers");
    XLSX.writeFile(wb, "retailers.xlsx");
  };

  // ----------------- CLEAR / DEDUCT BILLS -----------------
  const handleClearBill = async (retailer) => {
    const unpaidBills = retailer.unpaidBills;
    const totalDue = retailer.totalDue;
    if (totalDue <= 0) return alert("No dues to clear.");

    let amount = parseFloat(
      prompt(`Enter amount to clear (Total: ₹${totalDue})`)
    );
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount");

    const confirmAmount = parseFloat(prompt("Retype the amount to confirm:"));
    if (amount !== confirmAmount) return alert("Amount mismatch");
    if (amount > totalDue) return alert("Cannot clear more than total due");

    try {
      let remaining = amount;
      for (let bill of unpaidBills) {
        if (remaining <= 0) break;
        const clearAmount = Math.min(bill.amount, remaining);
        await axios.put(`${BASE_URL}/bills/clear/${bill.id}`, {
          clearedAmount: clearAmount,
        });
        remaining -= clearAmount;
      }
      alert(`₹${amount} cleared for ${retailer.name}`);
      fetchRetailers();
    } catch (err) {
      console.error("Error clearing bill:", err);
      alert("Failed to clear bill");
    }
  };

  // ----------------- FORMAT DATE -----------------
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  // ----------------- RESET FILTER -----------------
  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  // ----------------- FILTER RETAILERS -----------------
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
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search retailers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
        />
        <button onClick={handleExport} className="add-btn">
          Export to Excel
        </button>
      </div>

      {/* Date Filter */}
      <div className="date-filter-container">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button className="reset-btn" onClick={resetFilter}>
          Reset Filter
        </button>
      </div>

      {/* Form */}
      <div className="form-container">
        <input
          name="name"
          placeholder="Retailer Name *"
          value={form.name}
          onChange={handleChange}
          className="input-field"
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="number"
          name="contactNumber"
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={handleChange}
          className="input-field"
        />
        <button onClick={handleAddOrUpdate} className="add-btn">
          {editingId ? "Update Retailer" : "Add Retailer"}
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        {filteredRetailers.length > 0 ? (
          <table className="vendors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Total Due</th>
                <th>Bills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRetailers.map((r) => {
                const filteredBills = (r.allBills || [])
                  .filter((bill) => {
                    const billDate = new Date(bill.date);
                    const start = startDate ? new Date(startDate) : null;
                    const end = endDate ? new Date(endDate) : null;
                    return (
                      (!start || billDate >= start) && (!end || billDate <= end)
                    );
                  })
                  .sort((a, b) => new Date(b.date) - new Date(a.date));

                return (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.address || "—"}</td>
                    <td>{r.contactNumber || "—"}</td>
                    <td>₹{r.totalDue || 0}</td>
                    <td>
                      {filteredBills.length > 0 && (
                        <select className="bill-dropdown">
                          <option value="" disabled>
                            Select Bill
                          </option>
                          {filteredBills.map((bill) => (
                            <option key={bill.id} value={bill.id}>
                              {formatDate(bill.date)} - ₹{bill.amount} -{" "}
                              {bill.status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="action-buttons">
                      <button
                        className="delete-icon-btn"
                        onClick={() => handleEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-icon-btn"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                      {filteredBills.some((bill) => bill.status !== "Paid") && (
                        <button
                          className="clear-btn"
                          onClick={() =>
                            handleClearBill({
                              ...r,
                              unpaidBills: filteredBills.filter(
                                (b) => b.status !== "Paid"
                              ),
                            })
                          }
                        >
                          Clear / Deduct
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No retailers found.</p>
        )}
      </div>
    </div>
  );
}
