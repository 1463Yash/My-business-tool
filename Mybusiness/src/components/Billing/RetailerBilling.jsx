import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { calculateItemTotal } from "./calculate";
export default function RetailerBilling() {
  const [retailers, setRetailers] = useState([]);
  const [productcode, setProductcode] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
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
        const res = await axios.get("http://localhost:3000/retailer-billing");
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
      (p) => p.productcode === selectedCode // Match by product code
    );
    // Warning if quantity is less than available stock
    if (Number(newItem.quantity) >= selectedProduct.available_stock) {
      return alert(
        `Warning: Entered quantity is less than available stock (${selectedProduct.available_stock}).`
      );
    }
    console.log(selectedProduct.available_stock);
    if (selectedProduct) {
      setNewItem((prev) => ({
        ...prev,
        productcode: selectedCode,
        name: selectedProduct.name || "", // Auto-fill description
        hsn: selectedProduct.hsn || "", // Auto-fill HSN code
        gst: selectedProduct.gst || 0,
        price: selectedProduct.last_price || "",
        quantity: "",
      }));
    }
  };

  const handleDeleteItem = (index) => {
    setBillItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  ///////-------------here------------------------------///////
  const handleAddItem = () => {
    const finalTotal = calculateItemTotal(newItem);
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
        finalTotal,
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

      await axios.post("http://localhost:3000/retailer-billing", {
        retailerid: selectedId,
        final_amount: totalAmount,
        items: billItems,
      });

      alert("Bill submitted successfully!");
      setBillItems([]);
      setSelectedId("");
      setNewItem({
        productcode: "",
        name: "",
        hsn: "",
        gst: "",
        quantity: "",
        price: "",
        discount: "",
        discountType: "percent",
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
              <option key={p.productcode} value={p.productcode}>
                {p.productcode}
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
              setNewItem({
                ...newItem,
                discount: Math.max(0, parseFloat(e.target.value || 0)),
              })
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
          onChange={(e) =>
            setNewItem({
              ...newItem,
              gst: Math.max(0, parseFloat(e.target.value || 0)),
            })
          }
          className="input-field"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          min={1}
          max={
            productcode.find((p) => p.productcode === selectedProductCode)
              ?.available_stock || 1
          }
          onChange={(e) => {
            const value = parseFloat(e.target.value || 0);
            const selectedProduct = productcode.find(
              (p) => p.productcode === selectedProductCode
            );

            if (selectedProduct) {
              // Prevent quantity higher than available stock
              const validValue = Math.min(
                value,
                selectedProduct.available_stock
              );
              setNewItem({ ...newItem, quantity: validValue });
            } else {
              setNewItem({ ...newItem, quantity: value });
            }
          }}
          className="input-field"
        />

        <input
          type="number"
          placeholder="Unit Price"
          value={newItem.price}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              price: Math.max(0, parseFloat(e.target.value || 0)),
            })
          }
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
                <tr key={`${item.productcode}-${index}`}>
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
