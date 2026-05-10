
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const INITIAL = {
  name: "", company: "", email: "", phone: "",
  source: "", assignedTo: "", status: "New", dealValue: "",
};

const SOURCES  = ["Website", "LinkedIn", "Referral", "Cold Email", "Event", "Other"];
const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

const FIELDS = [
  { name: "name",       label: "Lead Name",          type: "text",   placeholder: "Jane Smith",          half: true  },
  { name: "company",    label: "Company",             type: "text",   placeholder: "Acme Corp",           half: true  },
  { name: "email",      label: "Email Address",       type: "email",  placeholder: "jane@acme.com",       half: true  },
  { name: "phone",      label: "Phone Number",        type: "text",   placeholder: "+1 555 000 0000",     half: true  },
  { name: "assignedTo", label: "Assigned Salesperson",type: "text",   placeholder: "John Doe",            half: true  },
  { name: "dealValue",  label: "Estimated Deal Value",type: "number", placeholder: "5000",                half: true  },
];

export default function CreateLead() {
  const [formData, setFormData] = useState(INITIAL);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/leads", formData);
      setSuccess(true);
      setTimeout(() => navigate("/leads"), 1400);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={S.page}>
        <div style={S.inner}>
          {/* Page header */}
          <div className="fade-up" style={S.header}>
            <div>
              <h1 style={S.h1}>New Lead</h1>
              <p style={S.sub}>Fill in the details below to add a lead to your pipeline.</p>
            </div>
            <button
              onClick={() => navigate("/leads")}
              style={S.backBtn}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--text-2)"; }}
            >
              ← Back to Leads
            </button>
          </div>

          <div className="fade-up-1" style={S.card}>
            {success && (
              <div style={S.successBox}>
                <span style={{ fontSize: "18px" }}>✓</span>
                Lead created successfully! Redirecting…
              </div>
            )}

            {error && <div style={S.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Section: Contact */}
              <div style={S.section}>
                <div style={S.sectionLabel}>Contact Info</div>
                <div style={S.grid2}>
                  {FIELDS.map(f => (
                    <div key={f.name} style={f.half ? {} : { gridColumn: "1 / -1" }}>
                      <label style={S.label}>{f.label}</label>
                      <input
                        type={f.type}
                        name={f.name}
                        placeholder={f.placeholder}
                        value={formData[f.name]}
                        onChange={handleChange}
                        style={S.input}
                        required={["name", "company", "email"].includes(f.name)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Pipeline */}
              <div style={S.section}>
                <div style={S.sectionLabel}>Pipeline Details</div>
                <div style={S.grid2}>
                  <div>
                    <label style={S.label}>Lead Source</label>
                    <div style={S.selectWrap}>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        style={S.select}
                      >
                        <option value="">Select a source…</option>
                        {SOURCES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <span style={S.chevron}>▾</span>
                    </div>
                  </div>

                  <div>
                    <label style={S.label}>Status</label>
                    <div style={S.selectWrap}>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={S.select}
                      >
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <span style={S.chevron}>▾</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={S.actions}>
                <button
                  type="submit"
                  disabled={loading || success}
                  style={{ ...S.submitBtn, opacity: loading || success ? 0.7 : 1 }}
                  onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={e => { if (!loading && !success) e.currentTarget.style.opacity = "1"; }}
                >
                  {loading ? "Creating…" : success ? "✓ Created!" : "Create Lead"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(INITIAL)}
                  style={S.resetBtn}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-3)"; }}
                >
                  Clear form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    padding: "36px 32px 72px",
  },
  inner: {
    maxWidth: "780px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  h1: {
    fontFamily: "var(--font-d)",
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.025em",
    marginBottom: "4px",
  },
  sub: { fontSize: "14px", color: "var(--text-2)" },
  backBtn: {
    padding: "8px 16px",
    background: "var(--bg-3)",
    color: "var(--text-2)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    padding: "36px",
    boxShadow: "var(--shadow)",
  },
  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "var(--green-bg)",
    border: "1px solid rgba(31,212,160,0.25)",
    color: "var(--green)",
    padding: "14px 18px",
    borderRadius: "var(--r-sm)",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "24px",
  },
  errorBox: {
    background: "var(--red-bg)",
    border: "1px solid rgba(255,91,110,0.22)",
    color: "var(--red)",
    padding: "12px 16px",
    borderRadius: "var(--r-sm)",
    fontSize: "13.5px",
    marginBottom: "22px",
  },
  section: {
    marginBottom: "32px",
  },
  sectionLabel: {
    fontSize: "11.5px",
    fontWeight: 700,
    color: "var(--text-3)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "16px",
    paddingBottom: "10px",
    borderBottom: "1px solid var(--border)",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px 20px",
  },
  label: {
    display: "block",
    fontSize: "12.5px",
    fontWeight: 500,
    color: "var(--text-2)",
    marginBottom: "7px",
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "var(--bg-3)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    color: "var(--text)",
    fontSize: "14px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  selectWrap: {
    position: "relative",
  },
  select: {
    width: "100%",
    padding: "11px 38px 11px 14px",
    background: "var(--bg-3)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    color: "var(--text)",
    fontSize: "14px",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  chevron: {
    position: "absolute",
    right: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-3)",
    fontSize: "12px",
    pointerEvents: "none",
  },
  actions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  submitBtn: {
    padding: "12px 28px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--r-sm)",
    fontSize: "14.5px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.18s",
    letterSpacing: "0.01em",
  },
  resetBtn: {
    padding: "12px 20px",
    background: "var(--bg-3)",
    color: "var(--text-2)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.18s",
  },
};