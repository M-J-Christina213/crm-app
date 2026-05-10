// src/pages/Leads.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

/* ─── Constants ──────────────────────────────────────────────── */
const STATUSES = ["", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const SOURCES  = ["", "Website", "LinkedIn", "Referral", "Cold Email", "Event", "Other"];

const STATUS_META = {
  "New":            { color: "var(--cyan)",   bg: "var(--cyan-bg)"   },
  "Contacted":      { color: "var(--amber)",  bg: "var(--amber-bg)"  },
  "Qualified":      { color: "var(--purple)", bg: "var(--purple-bg)" },
  "Proposal Sent":  { color: "var(--accent)", bg: "var(--accent-dim)"},
  "Won":            { color: "var(--green)",  bg: "var(--green-bg)"  },
  "Lost":           { color: "var(--red)",    bg: "var(--red-bg)"    },
};

const INITIAL_FORM = {
  name: "", company: "", email: "", phone: "",
  source: "", assignedTo: "", status: "New", dealValue: "",
};

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmt = (n) => "$" + Number(n || 0).toLocaleString();
const initials = (name = "") =>
  name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

/* ─── Main Component ──────────────────────────────────────────── */
export default function Leads() {
  const navigate = useNavigate();

  // Data
  const [leads, setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  // Edit modal
  const [editingLead, setEditingLead] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Notes panel
  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes]               = useState([]);
  const [noteText, setNoteText]         = useState("");
  const [notesLoading, setNotesLoading] = useState(false);

  /* ─── Fetch leads ─────────────────────────────────────────────── */
  useEffect(() => { fetchLeads(); }, [statusFilter, sourceFilter, assigneeFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter)   params.append("status", statusFilter);
      if (sourceFilter)   params.append("source", sourceFilter);
      if (assigneeFilter) params.append("assignedTo", assigneeFilter);
      const res = await API.get(`/leads?${params}`);
      setLeads(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* ─── Delete ─────────────────────────────────────────────── */
  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;
    await API.delete(`/leads/${id}`);
    if (selectedLead?._id === id) setSelectedLead(null);
    fetchLeads();
  };

  /* ─── Edit ───────────────────────────────────────────────── */
  const saveEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await API.put(`/leads/${editingLead._id}`, editingLead);
      setEditingLead(null);
      fetchLeads();
    } catch (err) { console.error(err); }
    finally { setEditLoading(false); }
  };

  /* ─── Notes ──────────────────────────────────────────────── */
  const openNotes = async (lead) => {
    setSelectedLead(lead);
    setNotesLoading(true);
    try {
      const res = await API.get(`/notes/${lead._id}`);
      setNotes(res.data);
    } catch (e) { console.error(e); }
    finally { setNotesLoading(false); }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    await API.post("/notes", {
      leadId: selectedLead._id,
      content: noteText,
      createdBy: "Admin",
    });
    setNoteText("");
    const res = await API.get(`/notes/${selectedLead._id}`);
    setNotes(res.data);
  };

  /* ─── Client-side search filter ─────────────────────────── */
  const displayed = leads.filter(l =>
    !search ||
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase())
  );

  /* ─── Unique assignees for filter ───────────────────────── */
  const assignees = [...new Set(leads.map(l => l.assignedTo).filter(Boolean))];

  /* ════════════════════════════════════════════════════════════
     RENDER
  ═════════════════════════════════════════════════════════════ */
  return (
    <>
      <Navbar />

      {/* Edit Modal */}
      {editingLead && (
        <EditModal
          lead={editingLead}
          loading={editLoading}
          onChange={e => setEditingLead({ ...editingLead, [e.target.name]: e.target.value })}
          onSave={saveEdit}
          onClose={() => setEditingLead(null)}
        />
      )}

      <div style={S.layout}>
        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div className="fade-up" style={S.header}>
            <div>
              <h1 style={S.h1}>Leads</h1>
              <p style={S.sub}>{displayed.length} lead{displayed.length !== 1 ? "s" : ""} shown</p>
            </div>
            <button style={S.newBtn} onClick={() => navigate("/create")}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              + New Lead
            </button>
          </div>

          {/* Filter bar */}
          <div className="fade-up-1" style={S.filterBar}>
            <div style={S.searchWrap}>
              <span style={S.searchIcon}>⌕</span>
              <input
                style={S.searchInput}
                placeholder="Search name, company, email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button style={S.clearBtn} onClick={() => setSearch("")}>✕</button>
              )}
            </div>

            <FilterSelect
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={STATUSES}
              labels={{ "": "All Statuses" }}
            />

            <FilterSelect
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              options={SOURCES}
              labels={{ "": "All Sources" }}
            />

            <FilterSelect
              value={assigneeFilter}
              onChange={e => setAssigneeFilter(e.target.value)}
              options={["", ...assignees]}
              labels={{ "": "All Reps" }}
            />

            {(statusFilter || sourceFilter || assigneeFilter || search) && (
              <button
                style={S.clearFilters}
                onClick={() => { setStatusFilter(""); setSourceFilter(""); setAssigneeFilter(""); setSearch(""); }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Leads table */}
          <div className="fade-up-2" style={S.tableWrap}>
            {loading ? (
              <Spinner />
            ) : displayed.length === 0 ? (
              <EmptyState />
            ) : (
              <table style={S.table}>
                <thead>
                  <tr>
                    {["Lead", "Company", "Status", "Source", "Assigned To", "Deal Value", "Actions"].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((lead, i) => (
                    <LeadRow
                      key={lead._id}
                      lead={lead}
                      isSelected={selectedLead?._id === lead._id}
                      onEdit={() => setEditingLead({ ...lead })}
                      onDelete={() => deleteLead(lead._id)}
                      onNotes={() => openNotes(lead)}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Notes panel ── */}
        {selectedLead && (
          <div className="fade-in" style={S.notesPanel}>
            <div style={S.notesPanelHead}>
              <div>
                <div style={S.notesPanelTitle}>{selectedLead.name}</div>
                <div style={S.notesPanelSub}>{selectedLead.company}</div>
              </div>
              <button style={S.closeNotes} onClick={() => setSelectedLead(null)}>✕</button>
            </div>

            {/* Quick status */}
            <div style={{ marginBottom: "20px" }}>
              <StatusBadge status={selectedLead.status} />
            </div>

            <div style={S.notesLabel}>Notes</div>

            {/* Add note */}
            <div style={S.noteInputWrap}>
              <textarea
                placeholder="Write a note…"
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                style={S.noteInput}
                rows={3}
                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) addNote(); }}
              />
              <button style={S.addNoteBtn} onClick={addNote}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Add Note
              </button>
            </div>

            {/* Notes list */}
            <div style={S.notesList}>
              {notesLoading ? <Spinner /> : notes.length === 0 ? (
                <p style={{ color: "var(--text-3)", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
                  No notes yet.
                </p>
              ) : (
                notes.map(n => (
                  <div key={n._id} style={S.noteCard}>
                    <div style={S.noteHeader}>
                      <div style={S.noteAvatar}>{initials(n.createdBy)}</div>
                      <div>
                        <div style={S.noteAuthor}>{n.createdBy}</div>
                        <div style={S.noteDate}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <p style={S.noteContent}>{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function LeadRow({ lead, isSelected, onEdit, onDelete, onNotes }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      style={{
        ...S.tr,
        background: isSelected ? "var(--surface-2)" : hovered ? "rgba(255,255,255,0.02)" : "transparent",
        borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={S.td}>
        <div style={S.leadName}>{lead.name}</div>
        <div style={S.leadEmail}>{lead.email}</div>
      </td>
      <td style={S.td}>
        <div style={{ fontSize: "13.5px" }}>{lead.company}</div>
        {lead.phone && <div style={S.leadEmail}>{lead.phone}</div>}
      </td>
      <td style={S.td}><StatusBadge status={lead.status} /></td>
      <td style={S.td}>
        <span style={S.sourceChip}>{lead.source || "—"}</span>
      </td>
      <td style={S.td}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div style={S.miniAvatar}>{initials(lead.assignedTo)}</div>
          <span style={{ fontSize: "13px" }}>{lead.assignedTo || "—"}</span>
        </div>
      </td>
      <td style={{ ...S.td, fontWeight: 600, color: "var(--green)", fontFamily: "var(--font-d)" }}>
        {fmt(lead.dealValue)}
      </td>
      <td style={S.td}>
        <div style={{ display: "flex", gap: "6px" }}>
          <ActionBtn label="Edit" color="var(--accent)" dimBg="var(--accent-dim)" onClick={onEdit} />
          <ActionBtn label="Notes" color="var(--purple)" dimBg="var(--purple-bg)" onClick={onNotes} />
          <ActionBtn label="Del" color="var(--red)" dimBg="var(--red-bg)" onClick={onDelete} />
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { color: "var(--text-2)", bg: "var(--surface-2)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "99px",
      fontSize: "12px", fontWeight: 600,
      color: meta.color, background: meta.bg,
    }}>
      <span style={{ fontSize: "8px" }}>●</span>
      {status}
    </span>
  );
}

function ActionBtn({ label, color, dimBg, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 11px",
        background: h ? dimBg : "transparent",
        color: h ? color : "var(--text-2)",
        border: `1px solid ${h ? color + "44" : "var(--border-2)"}`,
        borderRadius: "var(--r-sm)",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {label}
    </button>
  );
}

function FilterSelect({ value, onChange, options, labels = {} }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={onChange} style={S.filterSelect}>
        {options.map(o => (
          <option key={o} value={o}>{labels[o] ?? o}</option>
        ))}
      </select>
      <span style={S.filterChevron}>▾</span>
    </div>
  );
}

function EditModal({ lead, loading, onChange, onSave, onClose }) {
  const FIELDS = [
    { name: "name",       label: "Lead Name",     type: "text"   },
    { name: "company",    label: "Company",        type: "text"   },
    { name: "email",      label: "Email",          type: "email"  },
    { name: "phone",      label: "Phone",          type: "text"   },
    { name: "assignedTo", label: "Assigned To",    type: "text"   },
    { name: "dealValue",  label: "Deal Value",     type: "number" },
  ];
  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()} className="fade-up">
        <div style={S.modalHead}>
          <h2 style={S.modalTitle}>Edit Lead</h2>
          <button style={S.closeModal} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={onSave}>
          <div style={S.modalGrid}>
            {FIELDS.map(f => (
              <div key={f.name}>
                <label style={S.modalLabel}>{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={lead[f.name] || ""}
                  onChange={onChange}
                  style={S.modalInput}
                />
              </div>
            ))}

            <div>
              <label style={S.modalLabel}>Status</label>
              <div style={{ position: "relative" }}>
                <select name="status" value={lead.status} onChange={onChange} style={S.modalSelect}>
                  {["New","Contacted","Qualified","Proposal Sent","Won","Lost"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <span style={S.filterChevron}>▾</span>
              </div>
            </div>

            <div>
              <label style={S.modalLabel}>Lead Source</label>
              <div style={{ position: "relative" }}>
                <select name="source" value={lead.source} onChange={onChange} style={S.modalSelect}>
                  {["Website","LinkedIn","Referral","Cold Email","Event","Other"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <span style={S.filterChevron}>▾</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
            <button type="submit" disabled={loading} style={{ ...S.modalSave, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} style={S.modalCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
      <div style={{
        width: "32px", height: "32px",
        border: "3px solid var(--border-2)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "64px 20px" }}>
      <div style={{ fontSize: "36px", marginBottom: "14px", opacity: 0.3 }}>◈</div>
      <div style={{ color: "var(--text-2)", fontSize: "15px", fontWeight: 500 }}>No leads found</div>
      <div style={{ color: "var(--text-3)", fontSize: "13px", marginTop: "6px" }}>Try adjusting your filters or add a new lead.</div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const S = {
  layout: {
    display: "flex",
    gap: "20px",
    minHeight: "calc(100vh - 60px)",
    padding: "32px 28px",
    background: "var(--bg)",
    alignItems: "flex-start",
  },

  /* Header */
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  h1: {
    fontFamily: "var(--font-d)",
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.025em",
    marginBottom: "2px",
  },
  sub: { fontSize: "13px", color: "var(--text-3)" },
  newBtn: {
    padding: "10px 22px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--r-sm)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.18s",
  },

  /* Filter bar */
  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "18px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchWrap: {
    position: "relative",
    flex: "1",
    minWidth: "200px",
  },
  searchIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-3)",
    fontSize: "18px",
    lineHeight: 1,
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "10px 36px 10px 38px",
    background: "var(--surface)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    color: "var(--text)",
    fontSize: "13.5px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  clearBtn: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "var(--text-3)",
    cursor: "pointer",
    fontSize: "12px",
    padding: "2px 4px",
  },
  filterSelect: {
    padding: "9px 32px 9px 13px",
    background: "var(--surface)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    color: "var(--text-2)",
    fontSize: "13px",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    transition: "border-color 0.2s",
    minWidth: "130px",
  },
  filterChevron: {
    position: "absolute",
    right: "11px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-3)",
    fontSize: "11px",
    pointerEvents: "none",
  },
  clearFilters: {
    padding: "9px 14px",
    background: "transparent",
    border: "1px solid var(--red-bg)",
    color: "var(--red)",
    borderRadius: "var(--r-sm)",
    fontSize: "12.5px",
    cursor: "pointer",
  },

  /* Table */
  tableWrap: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    overflow: "hidden",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "780px",
  },
  th: {
    padding: "13px 16px",
    textAlign: "left",
    fontSize: "11.5px",
    fontWeight: 700,
    color: "var(--text-3)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-2)",
    whiteSpace: "nowrap",
  },
  tr: {
    transition: "background 0.12s",
    borderBottom: "1px solid var(--border)",
    borderLeft: "2px solid transparent",
  },
  td: {
    padding: "14px 16px",
    verticalAlign: "middle",
    fontSize: "13.5px",
    color: "var(--text)",
  },
  leadName: { fontWeight: 600, marginBottom: "2px" },
  leadEmail: { fontSize: "12px", color: "var(--text-3)" },
  sourceChip: {
    fontSize: "12px",
    color: "var(--text-2)",
    background: "var(--bg-3)",
    padding: "3px 9px",
    borderRadius: "99px",
    border: "1px solid var(--border)",
  },
  miniAvatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b5fc0, #7c3aed)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 700,
    flexShrink: 0,
  },

  /* Notes panel */
  notesPanel: {
    width: "340px",
    flexShrink: 0,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    padding: "24px 22px",
    position: "sticky",
    top: "80px",
    maxHeight: "calc(100vh - 110px)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  notesPanelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
  },
  notesPanelTitle: {
    fontFamily: "var(--font-d)",
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.01em",
  },
  notesPanelSub: { fontSize: "12px", color: "var(--text-3)", marginTop: "2px" },
  closeNotes: {
    background: "var(--bg-3)",
    border: "1px solid var(--border-2)",
    color: "var(--text-2)",
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notesLabel: {
    fontSize: "11.5px",
    fontWeight: 700,
    color: "var(--text-3)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "12px",
  },
  noteInputWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px",
  },
  noteInput: {
    width: "100%",
    padding: "10px 13px",
    background: "var(--bg-3)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    color: "var(--text)",
    fontSize: "13.5px",
    resize: "vertical",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  addNoteBtn: {
    padding: "9px 16px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--r-sm)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.18s",
    alignSelf: "flex-end",
  },
  notesList: { flex: 1, overflowY: "auto" },
  noteCard: {
    background: "var(--bg-3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r)",
    padding: "13px",
    marginBottom: "10px",
  },
  noteHeader: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "8px",
  },
  noteAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--accent), #7c3aed)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 700,
    flexShrink: 0,
  },
  noteAuthor: { fontSize: "12.5px", fontWeight: 600, color: "var(--text)" },
  noteDate:   { fontSize: "11px", color: "var(--text-3)" },
  noteContent:{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.55 },

  /* Edit modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    zIndex: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "var(--surface)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-xl)",
    padding: "36px",
    width: "100%",
    maxWidth: "620px",
    boxShadow: "var(--shadow-lg)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  modalTitle: {
    fontFamily: "var(--font-d)",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.02em",
  },
  closeModal: {
    background: "var(--bg-3)",
    border: "1px solid var(--border-2)",
    color: "var(--text-2)",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 20px",
  },
  modalLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--text-2)",
    marginBottom: "6px",
    letterSpacing: "0.01em",
  },
  modalInput: {
    width: "100%",
    padding: "10px 13px",
    background: "var(--bg-3)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    color: "var(--text)",
    fontSize: "13.5px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  modalSelect: {
    width: "100%",
    padding: "10px 34px 10px 13px",
    background: "var(--bg-3)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    color: "var(--text)",
    fontSize: "13.5px",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  modalSave: {
    padding: "11px 26px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--r-sm)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.18s",
  },
  modalCancel: {
    padding: "11px 20px",
    background: "var(--bg-3)",
    color: "var(--text-2)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    fontSize: "14px",
    cursor: "pointer",
  },
};