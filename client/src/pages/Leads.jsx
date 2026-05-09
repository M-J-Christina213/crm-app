import { useEffect, useState } from "react";
import API from "../services/api";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingLead, setEditingLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "",
    assignedTo: "",
    status: "New",
    dealValue: "",
  });

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    const res = await API.get(`/leads?status=${statusFilter}`);
    setLeads(res.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createLead = async (e) => {
    e.preventDefault();

    await API.post("/leads", formData);

    fetchLeads();

    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "",
      assignedTo: "",
      status: "New",
      dealValue: "",
    });
  };

  const deleteLead = async (id) => {
  await API.delete(`/leads/${id}`);
  fetchLeads();
};

const startEdit = (lead) => {
  setEditingLead(lead);
};

const updateLead = async (e) => {
  e.preventDefault();

  await API.put(`/leads/${editingLead._id}`, editingLead);

  setEditingLead(null);
  fetchLeads();
};

const handleEditChange = (e) => {
  setEditingLead({
    ...editingLead,
    [e.target.name]: e.target.value,
  });
};

const fetchNotes = async (leadId) => {
  const res = await API.get(`/notes/${leadId}`);
  setNotes(res.data);
  setSelectedLead(leadId);
};

const addNote = async () => {
  await API.post("/notes", {
    leadId: selectedLead,
    content: noteText,
    createdBy: "admin",
  });

  setNoteText("");
  fetchNotes(selectedLead);
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leads</h1>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        >
        <option value="">All</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Proposal Sent">Proposal Sent</option>
        <option value="Won">Won</option>
        <option value="Lost">Lost</option>
        </select>

        <br /><br />

      <form onSubmit={createLead}>
        <input
          type="text"
          name="name"
          placeholder="Lead Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="source"
          placeholder="Lead Source"
          value={formData.source}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
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
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Proposal Sent</option>
          <option>Won</option>
          <option>Lost</option>
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

        <button type="submit">Create Lead</button>
      </form>

      <hr />

      {editingLead && (
        <form onSubmit={updateLead}>
            <h2>Edit Lead</h2>

            <input
            name="name"
            value={editingLead.name}
            onChange={handleEditChange}
            />

            <input
            name="company"
            value={editingLead.company}
            onChange={handleEditChange}
            />

            <input
            name="email"
            value={editingLead.email}
            onChange={handleEditChange}
            />

            <input
            name="phone"
            value={editingLead.phone}
            onChange={handleEditChange}
            />

            <input
            name="dealValue"
            value={editingLead.dealValue}
            onChange={handleEditChange}
            />

            <button type="submit">Update</button>
            <button onClick={() => setEditingLead(null)}>Cancel</button>
        </form>
        )}

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
          <button onClick={() => deleteLead(lead._id)}>
            Delete
          </button>
          <button onClick={() => startEdit(lead)}>
            Edit
            </button>
        </div>
      ))}
    </div>
  );
}

export default Leads;