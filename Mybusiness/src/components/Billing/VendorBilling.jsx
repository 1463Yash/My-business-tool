 import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function VendorsBilling() {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", hsn: "", gst: "", quantity: "", price: "" });
  const printRef = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vendors")) || [];
    setVendors(stored);
  }, []);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) return;
    setBillItems([...billItems, {
      ...newItem,
      quantity: parseFloat(newItem.quantity),
      price: parseFloat(newItem.price),
      gst: parseFloat(newItem.gst || 0),
    }]);
    setNewItem({ name: "", hsn: "", gst: "", quantity: "", price: "" });
  };

  const handleCreateBill = () => {
    if (!selectedId || billItems.length === 0) return alert("Select a vendor and add items.");

    const total = billItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      const gstAmount = itemTotal * (item.gst / 100);
      return sum + itemTotal + gstAmount;
    }, 0);

    const updated = vendors.map((v) => {
      if (v.id === parseInt(selectedId)) {
        return { ...v, totalPurchase: (v.totalPurchase || 0) + total };
      }
      return v;
    });

    localStorage.setItem("vendors", JSON.stringify(updated));
    alert("Bill saved and vendor's total updated.");
    setBillItems([]);
  };
///////////PRINT  FUNCTION FOR PRINT BILL NEED TO CHANGE THE BILL FORMAT//--------------------------------------------->
  const handlePrint = () => {                                                                                        //|
    window.print();                                                                                                  //|
  };                                                                                                                 //|
///////////////////////////////////////////////////////////////////////////--------------------------------------------->
  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor Bill", 10, 10);

    const rows = billItems.map((item) => [
      item.name,
      item.hsn,
      item.gst + "%",
      item.quantity,
      item.price.toFixed(2),
      (item.quantity * item.price * (1 + item.gst / 100)).toFixed(2),
    ]);

    doc.autoTable({
      head: [["Name", "HSN", "GST", "Qty", "Price", "Total"]],
      body: rows,
    });

    doc.save("vendor-bill.pdf");
  };

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Vendor Billing</h2>

      <input
        type="text"
        placeholder="Search Vendor by Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input-field"
        style={{ width: "250px", marginBottom: "10px" }}
      />

      {filteredVendors.length > 0 ? (
        <ul>
          {filteredVendors.map((v) => (
            <li
              key={v.id}
              style={{
                padding: "8px",
                background: selectedId === String(v.id) ? "#cce5ff" : "#f0f4f8",
                marginBottom: "6px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
              onClick={() => setSelectedId(String(v.id))}
            >
              {v.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No vendors found. Please add one first.</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3>Bill Items</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="HSN Code"
          value={newItem.hsn}
          onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })}
          className="input-field"
        />
        <input
          type="number"
          placeholder="GST %"
          value={newItem.gst}
          onChange={(e) => setNewItem({ ...newItem, gst: e.target.value })}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="input-field"
        />
        <button onClick={handleAddItem} className="add-btn">Add Item</button>
      </div>

      <div ref={printRef}>
        <table className="vendors-table" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>HSN</th>
              <th>GST %</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => {
              const total = item.quantity * item.price;
              const gstAmount = total * (item.gst / 100);
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.hsn}</td>
                  <td>{item.gst}%</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{(total + gstAmount).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleCreateBill} className="add-btn">Submit Bill</button>
        <button onClick={handlePrint} className="add-btn" style={{ marginLeft: "10px" }}>Print</button>
        <button onClick={handlePDF} className="add-btn" style={{ marginLeft: "10px" }}>Download PDF</button>
      </div>
    </div>
  );
}
