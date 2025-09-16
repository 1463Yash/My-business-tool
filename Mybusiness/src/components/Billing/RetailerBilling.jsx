import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function RetailerBilling() {
  const [retailers, setRetailers] = useState([]);
  const [productcode, setProductcode] = useState([]);

  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [
    selectedId, setSelectedId] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [newItem, setNewItem] = useState({
    productcode: "",
    name: "",
    hsn: "",
    gst: "",
    quantity: "",
    price: "",
    discount: "",
    discountType: "percent",
  });
  const billRef = useRef();

  useEffect(() => {
    const fetchretailers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/retailers");
        setRetailers(res.data);
      } catch (err) {
        console.log("Error fetching retailers data for billing", err);
      }
    };
    fetchretailers();
  }, []);

  // Fetch product codes
  useEffect(() => {
    const fetchProductCode = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/addproductcode");
        setProductcode(res.data);
      } catch (err) {
        console.error("Error in fetching product code", err);
      }
    };
    fetchProductCode();
  }, []);

  //  Auto-fill of description and HSN code
  const handleProductSelect = (e) => {
    const selectedCode = e.target.value;
    setSelectedProductCode(selectedCode);

    const selectedProduct = productcode.find(
      (p) => p.code === selectedCode // Match by product code
    );

    if (selectedProduct) {
      setNewItem((prev) => ({
        ...prev,
        productcode: selectedCode,
        name: selectedProduct.description || "", // Auto-fill description
        hsn: selectedProduct.HSN || "", // Auto-fill HSN code
      }));
    }
  };
  

  //calculate discount and GST 
  const calculateItemTotal = (item) => {
    let quantity = Number(item.quantity) || 0;
    let price = Number(item.price) || 0;
    let discount = Number(item.discount) || 0;
    let gst = Number(item.gst) || 0;
    let discountType = (item.discountType || "").toLowerCase();

    let itemTotal = quantity * price;

    if (discount > 0) {
      if (discountType === "percent") {
        itemTotal -= (itemTotal * discount) / 100;
      } else if (discountType === "flat") {
        itemTotal -= discount;
      }
    }

    itemTotal = Math.max(0, itemTotal); // prevent negative

    const gstAmount = itemTotal * (gst / 100);
    return itemTotal + gstAmount;
  };

  const total = billItems.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );
  console.log("Final Total:", total);

  const handleDeleteItem = (index) => {
    setBillItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  ///////-------------here------------------------------///////
  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) return;
    setBillItems([
      ...billItems,
      {
        ...newItem,
        quantity: parseFloat(newItem.quantity),
        price: parseFloat(newItem.price),
        gst: parseFloat(newItem.gst || 0),
        discount: parseFloat(newItem.discount || 0),
        discountType: newItem.discountType,
      },
    ]);
    setNewItem({
      name: "",
      hsn: "",
      gst: "",
      quantity: "",
      price: "",
      discount: "",
      discountType: "percent",
    });
  };

  const handleCreateBill = async () => {
    if (!selectedId || billItems.length === 0)
      return alert("Select a retailer and add items.");

    const totalAmount = billItems.reduce(
      (sum, item) => sum + calculateItemTotal(item),
      0
    );
    try {
      // 1️⃣ Create bill in /retailersbills table

      await axios.post("http://localhost:3000/bills", {
        
        
      });

      
      // 3️⃣ Refresh retailers list
      const res = await axios.get("http://localhost:3000/retailers");
      setRetailers(res.data);
    } catch (err) {
      console.error("Error creating bill:", err);
      alert("Failed to create bill. Check console for details.");
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
        {/* Select Product Code */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="productSelect" style={{ marginRight: "10px" }}>
            Select Product Code:
          </label>
          <select
            id="productSelect"
            value={selectedProductCode}
            onChange={handleProductSelect}
            className="input-field"
            style={{ width: "250px" }}
          >
            <option value="">-- Choose Product --</option>
            {productcode.map((p) => (
              <option key={p.code} value={p.code}>
                {p.code}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Product description"
          value={newItem.name}
          readOnly
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="HSN Code"
          value={newItem.hsn}
          readOnly
          onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })}
          className="input-field"
        />

        <div className="discount-container">
          <input
            type="number"
            placeholder="Discount"
            className="input-field discount-input"
            value={newItem.discount}
            onChange={(e) =>
              setNewItem({ ...newItem, discount: e.target.value })
            }
          />
          <button
            type="button"
            className="discount-toggle"
            onClick={() =>
              setNewItem({
                ...newItem,
                discountType:
                  newItem.discountType === "percent" ? "flat" : "percent",
              })
            }
          >
            {newItem.discountType === "percent" ? "%" : "₹"}
          </button>
        </div>
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
          placeholder="Unit Price"
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
              <th>Product code</th>
              <th>Description</th>
              <th>HSN</th>
              <th>Discount</th>
              <th>GST %</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => {
              const finalTotal = calculateItemTotal(item);

              return (
                <tr key={index}>
                  <td>{item.productcode}</td>
                  <td>{item.name}</td>
                  <td>{item.hsn}</td>
                  <td>
                    {item.discount}{" "}
                    {item.discountType === "percent" ? "%" : "₹"}
                  </td>
                  <td>{item.gst}%</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{finalTotal.toFixed(2)}</td>

                  <td>
                    <button onClick={() => handleDeleteItem(index)}>❌</button>
                  </td>
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
