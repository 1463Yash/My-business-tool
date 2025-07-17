 import React, { useState } from "react";
import Home from "./components/Home";
import Inventory from "./components/Inventory";
import Vendors from "./components/Vendors";
import Retailers from "./components/Retailers";
import VendorBilling from "./components/Billing/VendorBilling";
import RetailerBilling from "./components/Billing/RetailerBilling";

import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home />;
      case "inventory":
        return <Inventory />;
      case "vendors":
        return <Vendors />;
      case "retailers":
        return <Retailers />;
      case "vendorBilling":
        return <VendorBilling />;
      case "retailerBilling":
        return <RetailerBilling />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Business Tool</h2>
        <nav className="nav-menu">
          <div
            className={`nav-item ${activePage === "home" ? "active" : ""}`}
            onClick={() => setActivePage("home")}
          >
            Home
          </div>
          <div
            className={`nav-item ${activePage === "inventory" ? "active" : ""}`}
            onClick={() => setActivePage("inventory")}
          >
            Inventory
          </div>
          <div
            className={`nav-item ${activePage === "vendors" ? "active" : ""}`}
            onClick={() => setActivePage("vendors")}
          >
            Vendors
          </div>
          <div
            className={`nav-item ${activePage === "retailers" ? "active" : ""}`}
            onClick={() => setActivePage("retailers")}
          >
            Retailers
          </div>
          <div
            className={`nav-item ${activePage === "vendorBilling" ? "active" : ""}`}
            onClick={() => setActivePage("vendorBilling")}
          >
            Vendor Billing
          </div>
          <div
            className={`nav-item ${activePage === "retailerBilling" ? "active" : ""}`}
            onClick={() => setActivePage("retailerBilling")}
          >
            Retailer Billing
          </div>
        </nav>
      </aside>
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}
