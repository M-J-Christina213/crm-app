import { useEffect, useState } from "react";
import API from "../services/api";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingLead, setEditingLead] = useState(null);

  // NOTES
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadData, setSelectedLeadData] = useState(null);

  // CREATE FORM
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

  const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  width: "100%",
};

const primaryButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

const dangerButton = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

const secondaryButton = {
  background: "#0f172a",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

  // FETCH LEADS
  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    try {
      const res = await API.get(`/leads?status=${statusFilter}`);
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  // CREATE LEAD
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createLead = async (e) => {
    e.preventDefault();

    try {
      await API.post("/leads", formData);

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

      fetchLeads();
    } catch (err) {
      console.error("Error creating lead:", err);
    }
  };

  // DELETE LEAD
  const deleteLead = async (id) => {
    try {
      await API.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  // EDIT LEAD
  const startEdit = (lead) => {
    setEditingLead(lead);
  };

  const handleEditChange = (e) => {
    setEditingLead({
      ...editingLead,
      [e.target.name]: e.target.value,
    });
  };

  const updateLead = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/leads/${editingLead._id}`, editingLead);

      setEditingLead(null);

      fetchLeads();
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  // ---------------- NOTES ----------------

  const fetchNotes = async (lead) => {
    setSelectedLead(lead._id);
    setSelectedLeadData(lead);

    try {
      const res = await API.get(`/notes/${lead._id}`);

      setNotes(res.data);

      setTimeout(() => {
        document
          .getElementById("notes-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 50);

    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;

    try {
      await API.post("/notes", {
        leadId: selectedLead,
        content: noteText,
        createdBy: "admin",
      });

      setNoteText("");

      fetchNotes(selectedLeadData);

    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      padding: "30px",
      fontFamily: "Arial",
    }}
  >
    <h1
      style={{
        fontSize: "32px",
        marginBottom: "20px",
        color: "#1e293b",
      }}
    >
      CRM Lead Management
    </h1>

    {/* TOP BAR */}
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
        alignItems: "center",
      }}
    >
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          width: "200px",
        }}
      >
        <option value="">All Leads</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Proposal Sent">Proposal Sent</option>
        <option value="Won">Won</option>
        <option value="Lost">Lost</option>
      </select>
    </div>

    {/* CREATE LEAD CARD */}
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "30px",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#0f172a" }}>
        Create New Lead
      </h2>

      <form onSubmit={createLead}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Lead Name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="source"
            placeholder="Lead Source"
            value={formData.source}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="assignedTo"
            placeholder="Assigned Salesperson"
            value={formData.assignedTo}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Proposal Sent</option>
            <option>Won</option>
            <option>Lost</option>
          </select>

          <input
            type="number"
            name="dealValue"
            placeholder="Deal Value"
            value={formData.dealValue}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create Lead
        </button>
      </form>
    </div>

    {/* EDIT FORM */}
    {editingLead && (
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "18px",
          marginBottom: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Edit Lead</h2>

        <form onSubmit={updateLead}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <input
              name="name"
              value={editingLead.name}
              onChange={handleEditChange}
              style={inputStyle}
            />

            <input
              name="company"
              value={editingLead.company}
              onChange={handleEditChange}
              style={inputStyle}
            />

            <input
              name="email"
              value={editingLead.email}
              onChange={handleEditChange}
              style={inputStyle}
            />

            <input
              name="phone"
              value={editingLead.phone}
              onChange={handleEditChange}
              style={inputStyle}
            />

            <input
              name="dealValue"
              value={editingLead.dealValue}
              onChange={handleEditChange}
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={primaryButton}
            >
              Update
            </button>

            <button
              type="button"
              onClick={() => setEditingLead(null)}
              style={dangerButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    {/* LEADS GRID */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
      }}
    >
      {leads.map((lead) => (
        <div
          key={lead._id}
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ color: "#0f172a" }}>
            {lead.name}
          </h2>

          <p><strong>Company:</strong> {lead.company}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Status:</strong> {lead.status}</p>
          <p><strong>Value:</strong> ${lead.dealValue}</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => startEdit(lead)}
              style={primaryButton}
            >
              Edit
            </button>

            <button
              onClick={() => deleteLead(lead._id)}
              style={dangerButton}
            >
              Delete
            </button>

            <button
              onClick={() => fetchNotes(lead)}
              style={secondaryButton}
            >
              Notes
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* NOTES PANEL */}
    {selectedLead && (
      <div
        id="notes-section"
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "18px",
          marginTop: "35px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <h2>
          Notes — {selectedLeadData?.name}
        </h2>

        <p>
          <strong>Company:</strong> {selectedLeadData?.company}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Write a note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            style={{
              ...inputStyle,
              flex: 1,
            }}
          />

          <button
            onClick={addNote}
            style={primaryButton}
          >
            Add Note
          </button>
        </div>

        <div style={{ marginTop: "20px" }}>
          {notes.map((n) => (
            <div
              key={n._id}
              style={{
                background: "#f8fafc",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
            >
              <strong>{n.createdBy}</strong>

              <p style={{ marginTop: "5px" }}>
                {n.content}
              </p>

              <small style={{ color: "gray" }}>
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  );
}

export default Leads;