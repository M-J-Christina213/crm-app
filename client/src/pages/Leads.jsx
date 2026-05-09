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
    <div style={{ padding: "20px" }}>
      <h1>Leads</h1>

      {/* FILTER */}
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

      {/* CREATE LEAD */}
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

        <button type="submit">
          Create Lead
        </button>
      </form>

      <hr />

      {/* EDIT FORM */}
      {editingLead && (
        <form onSubmit={updateLead}>
          <h2>Edit Lead</h2>

          <input
            name="name"
            value={editingLead.name}
            onChange={handleEditChange}
          />

          <br /><br />

          <input
            name="company"
            value={editingLead.company}
            onChange={handleEditChange}
          />

          <br /><br />

          <input
            name="email"
            value={editingLead.email}
            onChange={handleEditChange}
          />

          <br /><br />

          <input
            name="phone"
            value={editingLead.phone}
            onChange={handleEditChange}
          />

          <br /><br />

          <input
            name="dealValue"
            value={editingLead.dealValue}
            onChange={handleEditChange}
          />

          <br /><br />

          <button type="submit">
            Update
          </button>

          <button
            type="button"
            onClick={() => setEditingLead(null)}
          >
            Cancel
          </button>
        </form>
      )}

      <hr />

      {/* LEADS */}
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

          <button onClick={() => fetchNotes(lead)}>
            Notes
          </button>
        </div>
      ))}

      {/* NOTES SECTION */}
      {selectedLead && (
        <div
          id="notes-section"
          style={{
            border: "2px solid blue",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>
            Notes for {selectedLeadData?.name}
          </h2>

          <p>
            Company: {selectedLeadData?.company}
          </p>

          <p>
            Status: {selectedLeadData?.status}
          </p>

          <input
            type="text"
            placeholder="Write a note"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />

          <button onClick={addNote}>
            Add Note
          </button>

          <button
            onClick={() => {
              setSelectedLead(null);
              setSelectedLeadData(null);
              setNotes([]);
            }}
          >
            Close Notes
          </button>

          <hr />

          {notes.length === 0 && (
            <p>No notes yet.</p>
          )}

          {notes.map((n) => (
            <div
              key={n._id}
              style={{
                border: "1px solid black",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <strong>{n.createdBy}</strong>

              <p>{n.content}</p>

              <small>
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Leads;