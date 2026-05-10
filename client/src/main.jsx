import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import CreateLead from "./pages/CreateLead";
import './styles/global.css';

// Blocks access to any route if user is not logged in
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Protected */}
      <Route path="/app" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/leads" element={
        <ProtectedRoute><Leads /></ProtectedRoute>
      } />
      <Route path="/create" element={
        <ProtectedRoute><CreateLead /></ProtectedRoute>
      } />

      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);