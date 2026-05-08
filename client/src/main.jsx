import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<Dashboard />} />
      <Route path="/leads" element={<Leads />} />
    </Routes>
  </BrowserRouter>
);