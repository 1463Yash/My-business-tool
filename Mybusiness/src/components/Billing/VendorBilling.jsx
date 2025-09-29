import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { calculateItemTotal } from "./calculate";
export default function VendorsBilling() {
  const [vendors, setVendors] = useState([]);
  const [productcode, setProductcode] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [billItems, setBillItems] = useState([]);
  
  const [selectedProductCode, setSelectedProductCode] = useState("");
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
  const printRef = useRef();
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/vendors");
        setVendors(res.data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };
    fetchVendors();
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
        productcode: selectedProduct.code || "",
        name: selectedProduct.description || "", // Auto-fill description
        hsn: selectedProduct.HSN || "", // Auto-fill HSN code
      }));
    }
  };
  
  const handleDeleteItem = (index) => {
    setBillItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    const finalTotal=calculateItemTotal(newItem);
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
        finalTotal
      },
    ]);
    setNewItem({
      productcode:"",
      name: "",
      hsn: "",
      gst: "",
      quantity: "",
      price: "",
      discount: "",
      discountType: "percent",
    });
  };
/////////////////////////////////////////////////////////////////////
  const handleCreateBill = async() => {
    if (!selectedId || billItems.length === 0)
      return alert("Select a vendor and add items.");

    const totalAmount=billItems.reduce(
      (sum,item)=>sum+calculateItemTotal(item),
      0
    );


    try{
       await axios.post("http://localhost:3000/vendor-billing",{
       vendorsid:selectedId,
       finalamount:totalAmount,
       items:billItems});
       
        console.log("Vendors bill submitted successfully!");
       alert("Bill submitted successfully!");
       setBillItems([]);
       setNewItem({
        productcode:"",
        name:"",
        hsn:"",
        gst:"",
        quantity:"",
        price:"",
        discount:"",
        discountType:"percent",
       })
       const res=await axios.get("http://localhost:3000/api/vendors");
       setVendors(res.data);
    }catch(err){
      console.log("Error creating bill:",err);
      alert("Failed to create bill.Check console for details.");
    }

  };//////////////////////////////////////////on working/////////////






  ///////////PRINT  FUNCTION FOR PRINT BILL NEED TO CHANGE THE BILL FORMAT//--------------------------------------------->
  const handlePrint = () => {
    //|
    window.print(); //|
  }; //|
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

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="vendorSelect" style={{ marginRight: "10px" }}>
          Select Vendor:
        </label>
        <select
          id="vendorSelect"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="input-field"
          style={{ width: "250px" }}
        >
          <option value="">-- Choose Vendor --</option>
          {filteredVendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Bill Items</h3>
        {/*Working on the is starting here */}
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
              setNewItem({ ...newItem, 
                discount:Math.max(0,parseFloat(e.target.value ||0))
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
                  newItem.discountType === "percent" ? "value" : "percent",
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
          onChange={(e) => setNewItem({ ...newItem, 
          gst:Math.max(0,parseFloat(e.target.value || 0)) })}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, 
          quantity:Math.max(0,parseFloat(e.target.value || 0))
           })}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Unit Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, 
          price:Math.max(0,parseFloat(e.target.value || 0)) })}
          className="input-field"
        />
        <button onClick={handleAddItem} className="add-btn">
          Add Item
        </button>
      </div>

      <div ref={printRef}>
        <table className="vendors-table" style={{ marginTop: "20px" }}>
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
              const finalTotal= calculateItemTotal(item);

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
          Submit Bill
        </button>
        <button
          onClick={handlePrint}
          className="add-btn"
          style={{ marginLeft: "10px" }}
        >
          Print
        </button>
        <button
          onClick={handlePDF}
          className="add-btn"
          style={{ marginLeft: "10px" }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
