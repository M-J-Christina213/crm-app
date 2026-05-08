import { useEffect, useState } from "react";
import API from "../services/api";

export default function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await API.get("/leads");
      setLeads(res.data);
    };

    fetchLeads();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Leads</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Status</th>
            <th>Value</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.company}</td>
              <td>{lead.email}</td>
              <td>{lead.status}</td>
              <td>{lead.dealValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}