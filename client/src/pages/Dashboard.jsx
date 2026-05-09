import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { pageStyle, card, buttonPrimary } from "../styles/ui";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <>
      <Navbar />

      <div style={pageStyle}>
        <h1>Dashboard Overview</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: "15px",
          }}
        >
          <div style={card}>Total Leads: {data.totalLeads}</div>
          <div style={card}>New: {data.newLeads}</div>
          <div style={card}>Qualified: {data.qualifiedLeads}</div>
          <div style={card}>Won: {data.wonLeads}</div>
          <div style={card}>Lost: {data.lostLeads}</div>
          <div style={card}>Total Value: ${data.totalDealValue}</div>
          <div style={card}>Won Value: ${data.wonDealValue}</div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Link to="/leads">
            <button style={buttonPrimary}>Go To Leads</button>
          </Link>
        </div>
      </div>
    </>
  );
}