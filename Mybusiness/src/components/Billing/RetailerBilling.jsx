import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function RetailerBilling() {
  const [retailers, setRetailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", hsn: "", gst: "", quantity: "", price: "" });
  const billRef = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("retailers")) || [];
    setRetailers(stored);
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
    if (!selectedId || billItems.length === 0) return alert("Select a retailer and add items.");

    const total = billItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      const gstAmount = itemTotal * (item.gst / 100);
      return sum + itemTotal + gstAmount;
    }, 0);

    const updated = retailers.map((r) => {
      if (r.id === parseInt(selectedId)) {
        return { ...r, totalPurchase: (r.totalPurchase || 0) + total };
      }
      return r;
    });

    localStorage.setItem("retailers", JSON.stringify(updated));
    alert("Bill saved and retailer's total updated.");
    setBillItems([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = billRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("retail-bill.pdf");
  };

  const filteredRetailers = retailers.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Retailer Billing</h2>

      <input
        type="text"
        placeholder="Search Retailer by Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input-field"
        style={{ width: "250px", marginBottom: "10px" }}
      />

      {filteredRetailers.length > 0 ? (
        <ul>
          {filteredRetailers.map((r) => (
            <li
              key={r.id}
              style={{
                padding: "8px",
                background: selectedId === String(r.id) ? "#cce5ff" : "#f0f4f8",
                marginBottom: "6px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
              onClick={() => setSelectedId(String(r.id))}
            >
              {r.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No retailers found. Please add one first.</p>
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

      <div ref={billRef} style={{ marginTop: "20px" }}>
        <table className="vendors-table">
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
        <button onClick={handleCreateBill} className="add-btn">Submit bill</button>
        <button onClick={handlePrint} className="add-btn" style={{ marginLeft: "10px" }}>Print</button>
        <button onClick={handleDownloadPDF} className="add-btn" style={{ marginLeft: "10px" }}>Download PDF</button>
      </div>
    </div>
  );
}
