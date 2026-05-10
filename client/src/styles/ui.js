// src/styles/ui.js  –  Shared design tokens

export const pageStyle = {
  minHeight: "100vh",
  background: "var(--bg)",
  padding: "36px 32px 72px",
};

export const card = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--r-lg)",
  padding: "28px",
  boxShadow: "var(--shadow)",
};

export const input = {
  width: "100%",
  padding: "11px 14px",
  background: "var(--bg-3)",
  border: "1px solid var(--border-2)",
  borderRadius: "var(--r-sm)",
  color: "var(--text)",
  fontSize: "14px",
  transition: "border-color 0.2s, box-shadow 0.2s",
  marginBottom: "12px",
};

export const selectStyle = {
  ...input,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
};

export const buttonPrimary = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "10px 22px",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--r-sm)",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  letterSpacing: "0.01em",
  transition: "opacity 0.18s",
};

export const buttonDanger = {
  ...buttonPrimary,
  background: "var(--red-bg)",
  color: "var(--red)",
  border: "1px solid rgba(255,91,110,0.2)",
};

export const buttonGhost = {
  ...buttonPrimary,
  background: "var(--bg-3)",
  color: "var(--text-2)",
  border: "1px solid var(--border-2)",
};

export const buttonDark = buttonGhost;

// Status metadata – colour + label
export const STATUS_META = {
  "New":           { color: "var(--cyan)",   bg: "var(--cyan-bg)"   },
  "Contacted":     { color: "var(--amber)",  bg: "var(--amber-bg)"  },
  "Qualified":     { color: "var(--purple)", bg: "var(--purple-bg)" },
  "Proposal Sent": { color: "var(--accent)", bg: "var(--accent-dim)"},
  "Won":           { color: "var(--green)",  bg: "var(--green-bg)"  },
  "Lost":          { color: "var(--red)",    bg: "var(--red-bg)"    },
};

export const statusBadge = (status) => {
  const meta = STATUS_META[status] || { color: "var(--text-2)", bg: "var(--surface-2)" };
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "3px 11px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
    color: meta.color,
    background: meta.bg,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  };
};