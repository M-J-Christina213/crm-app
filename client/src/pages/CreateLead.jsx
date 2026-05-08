import { useState } from "react";
import API from "../services/api";

export default function CreateLead() {

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "",
    assignedTo: "",
    status: "New",
    dealValue: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/leads", formData);

      alert("Lead created successfully!");

      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        source: "",
        assignedTo: "",
        status: "New",
        dealValue: ""
      });

    } catch (err) {
      console.log(err);
      alert("Error creating lead");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Lead</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Lead Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="source"
          placeholder="Lead Source"
          value={formData.source}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="assignedTo"
          placeholder="Assigned Salesperson"
          value={formData.assignedTo}
          onChange={handleChange}
        />
        <br /><br />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>

        <br /><br />

        <input
          type="number"
          name="dealValue"
          placeholder="Deal Value"
          value={formData.dealValue}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Create Lead
        </button>

      </form>
    </div>
  );
}