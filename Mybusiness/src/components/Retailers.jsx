import React, { useState, useEffect } from "react";
import { FolderInput } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import "reactjs-popup/dist/index.css";
import PayDuesPopup from "./Popupforpayment/PaymentDuespopup";
const BASE_URL = "http://localhost:3000";

export default function Retailers() {
  const [retailers, setRetailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showVisible,setVisible]=useState(false);
  const [selectedUserid,setSelecteduserid]=useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNumber: "",
    total_dues: "",
  });
  useEffect(() => {
    fetchRetailers();
  }, []);

  // ----------------- FETCH RETAILERS WITH BILLS -----------------
  const fetchRetailers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/retailers");
      setRetailers(res.data);
    } catch (err) {
      console.log("Error in fetching retailers data", err);
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
        await axios.post(`http://localhost:3000/retailers`, form);
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
    const retailerid = retailers.find((r) => r.id === id);
    if (retailerid && Number(retailerid.total_dues) > 0) {
      return alert(`Cannot close this account, First clear dues`);
    }
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
    setEditingId(retailers.id);
  };

  // ----------------- EXPORT TO EXCEL -----------------
  const handleExport = () => {
    const exportData = retailers.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Retailers");
    XLSX.writeFile(wb, "retailers.xlsx");
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


  const  handlepaydues=async(id)=>{
    const retailerdues=retailers.find(r=> r.id===id);
    const dues=retailerdues.total_dues;
    console.log(dues);
    console.log(id);
    if(dues <=0){
      alert (`Cannot Pay current dues is 0`);
      return;
    }
    else{
      setSelecteduserid(id);
      setVisible(true);
    }
  };
  return (
    <div className="main-content">
      <h2>Retailers</h2>

      {/* Search + Export */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Search retailers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
        />
        <button onClick={handleExport} className="add-btn tooltip">
          <FolderInput />
          <span className="tooltiptext">Export to Excel</span>
        </button>
      </div>

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
        {editingId && (
          <button
            className="add-btn"
            style={{ backgroundColor: "gray", marginLeft: "10px" }}
            onClick={() => {
              setForm({
                name: "",
                contactNumber: "",
                address: "",
                total_dues: "",
              });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
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
                <th>Amount Due</th>
                <th>Pay dues</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRetailers.map((r) => {
                return (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.address || "—"}</td>
                    <td>{r.contactNumber || "—"}</td>
                    <td>
                      <b>
                        ₹
                        {Number(r.total_dues).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || 0}
                      </b>
                    </td>
                    <td>
                      <button
                        className="delete-icon-btn"
                        onClick={()=>handlepaydues(r.id)}
                      >
                        Pay dues
                      </button>
                      {showVisible &&
                      (<PayDuesPopup 
                       userid={selectedUserid}
                       popupdata={retailers}
                       onClose={()=>setVisible(false)}
                       type="retailer"
                        />)}
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
                        Close Account
                      </button>
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
