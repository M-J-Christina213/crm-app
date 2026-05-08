import { useEffect, useState } from "react";
import API from "../services/api";

function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await API.get("/leads");
    setLeads(res.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leads</h1>

      {leads.map((lead) => (
        <div
          key={lead._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{lead.name}</h3>
          <p>Company: {lead.company}</p>
          <p>Email: {lead.email}</p>
          <p>Status: {lead.status}</p>
          <p>Value: ${lead.dealValue}</p>
        </div>
      ))}
    </div>
  );
}

export default Leads;