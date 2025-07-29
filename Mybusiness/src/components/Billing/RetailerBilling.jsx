import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function RetailerBilling() {
  const [retailers, setRetailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    hsn: "",
    gst: "",
    quantity: "",
    price: "",
  });
  const billRef = useRef();

  useEffect(() => {
    axios
      .get("http://localhost:3000/retailers")
      .then((res) => setRetailers(res.data))
      .catch((err) => console.error("Error fetching retailers:", err));
  }, []);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) return;
    setBillItems([
      ...billItems,
      {
        ...newItem,
        quantity: parseFloat(newItem.quantity),
        price: parseFloat(newItem.price),
        gst: parseFloat(newItem.gst || 0),
      },
    ]);
    setNewItem({ name: "", hsn: "", gst: "", quantity: "", price: "" });
  };

  const handleCreateBill = async () => {
    if (!selectedId || billItems.length === 0)
      return alert("Select a retailer and add items.");

    const total = billItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      const gstAmount = itemTotal * (item.gst / 100);
      return sum + itemTotal + gstAmount;
    }, 0);

    const selectedRetailer = retailers.find(
      (r) => r.id === parseInt(selectedId)
    );
    const updatedTotal = (selectedRetailer.totalPurchase || 0) + total;

    try {
      await axios.put(`http://localhost:3000/api/retailers/${selectedId}`, {
        ...selectedRetailer,
        totalPurchase: updatedTotal,
      });
      alert("Bill saved and retailer's total updated.");
      setBillItems([]);
      // Refresh list
      const res = await axios.get("http://localhost:3000/api/retailers");
      setRetailers(res.data);
    } catch (err) {
      console.error("Error updating retailer:", err);
    }
  };

  const handlePrint = () => window.print();

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

      <div style={{ marginBottom: "10px" }}>
        <label>Select Retailer: </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="input-field"
        >
          <option value="">-- Select Retailer --</option>
          {filteredRetailers.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

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
        <button onClick={handleAddItem} className="add-btn">
          Add Item
        </button>
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
        <button onClick={handleCreateBill} className="add-btn">
          Submit bill
        </button>
        <button
          onClick={handlePrint}
          className="add-btn"
          style={{ marginLeft: "10px" }}
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="add-btn"
          style={{ marginLeft: "10px" }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
