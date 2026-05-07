import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/dashboard");
      setData(res.data);
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM Dashboard</h1>

      <div>
        <p>Total Leads: {data.totalLeads}</p>
        <p>New Leads: {data.newLeads}</p>
        <p>Qualified: {data.qualifiedLeads}</p>
        <p>Won: {data.wonLeads}</p>
        <p>Lost: {data.lostLeads}</p>
        <p>Total Value: {data.totalDealValue}</p>
        <p>Won Value: {data.wonDealValue}</p>
      </div>
    </div>
  );
}