import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Home from "./components/Home";
import Inventory from "./components/Inventory";
import Vendors from "./components/Vendors";
import Retailers from "./components/Retailers";
import Add_product_code from "./components/Add_product_code";
import VendorBilling from "./components/Billing/VendorBilling";
import RetailerBilling from "./components/Billing/RetailerBilling";
import "./App.css";
export default function App() {
  return (
    <Router>
      <div className="app-container">
        <aside
          className="sidebar"
        >
          <h2>Business Tool</h2>
          <nav className="nav-menu">
            <NavLink to="/" end className="nav-item">
              Home
            </NavLink>
            <NavLink to="/inventory" className="nav-item">
              Inventory
            </NavLink>
            <NavLink to="/vendors" className="nav-item">
              Vendors
            </NavLink>
            <NavLink to="/retailers" className="nav-item">
              Retailers
            </NavLink>
            <NavLink to="/vendor-billing" className="nav-item">
              Vendor Billing
            </NavLink>
            <NavLink to="/retailer-billing" className="nav-item">
              Retailer Billing
            </NavLink>
            <NavLink to="/addproductcode" className="nav-item">
              Add Product code
            </NavLink>          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/retailers" element={<Retailers />} />
            <Route path="/vendor-billing" element={<VendorBilling />} />
            <Route path="/retailer-billing" element={<RetailerBilling />} />
            <Route path="/addproductcode" element={<Add_product_code />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
