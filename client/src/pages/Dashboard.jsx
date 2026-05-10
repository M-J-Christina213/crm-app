// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const STAT_CARDS = [
  { key: "totalLeads",     label: "Total Leads",    icon: "◈",  color: "var(--accent)",  bg: "var(--accent-dim)"  },
  { key: "newLeads",       label: "New",            icon: "●",  color: "var(--cyan)",    bg: "var(--cyan-bg)"     },
  { key: "qualifiedLeads", label: "Qualified",      icon: "◆",  color: "var(--purple)",  bg: "var(--purple-bg)"   },
  { key: "wonLeads",       label: "Won",            icon: "✓",  color: "var(--green)",   bg: "var(--green-bg)"    },
  { key: "lostLeads",      label: "Lost",           icon: "✕",  color: "var(--red)",     bg: "var(--red-bg)"      },
];

const fmt = (n) =>
  Number(n) >= 1000
    ? "$" + (Number(n) / 1000).toFixed(1) + "k"
    : "$" + Number(n).toLocaleString();

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <Loading />;

  const winRate =
    data.totalLeads > 0
      ? Math.round((data.wonLeads / data.totalLeads) * 100)
      : 0;

  const pipelineStages = [
    { label: "New",           value: data.newLeads,       color: "var(--cyan)"   },
    { label: "Qualified",     value: data.qualifiedLeads, color: "var(--purple)" },
    { label: "Won",           value: data.wonLeads,       color: "var(--green)"  },
    { label: "Lost",          value: data.lostLeads,      color: "var(--red)"    },
  ];
  const pipeTotal = pipelineStages.reduce((a, s) => a + (s.value || 0), 0) || 1;

  return (
    <>
      <Navbar />
      <div style={S.page}>
        {/* Header */}
        <div className="fade-up" style={S.header}>
          <div>
            <h1 style={S.h1}>Dashboard</h1>
            <p style={S.sub}>Welcome back, Admin — here's your pipeline at a glance.</p>
          </div>
          <Link to="/create" style={{ textDecoration: "none" }}>
            <button style={S.newBtn}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              + New Lead
            </button>
          </Link>
        </div>

        {/* Stat cards */}
        <div style={S.grid5}>
          {STAT_CARDS.map(({ key, label, icon, color, bg }, i) => (
            <div
              key={key}
              className={`fade-up-${i}`}
              style={S.statCard}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{ ...S.statIcon, color, background: bg }}>{icon}</div>
              <div style={S.statNum}>{data[key] ?? 0}</div>
              <div style={S.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* Value cards + Win Rate */}
        <div className="fade-up-2" style={S.grid3}>
          <ValueCard
            label="Total Pipeline Value"
            value={fmt(data.totalDealValue ?? 0)}
            color="var(--accent)"
            sub="Estimated across all leads"
          />
          <ValueCard
            label="Won Deal Value"
            value={fmt(data.wonDealValue ?? 0)}
            color="var(--green)"
            sub="Closed and converted"
          />
          <div style={S.winCard}>
            <div style={S.winLabel}>Win Rate</div>
            <div style={{ ...S.winNum, color: winRate >= 50 ? "var(--green)" : "var(--amber)" }}>
              {winRate}%
            </div>
            <div style={S.winBar}>
              <div style={{ ...S.winFill, width: `${winRate}%`, background: winRate >= 50 ? "var(--green)" : "var(--amber)" }} />
            </div>
            <div style={S.winSub}>
              {data.wonLeads} won of {data.totalLeads} total
            </div>
          </div>
        </div>

        {/* Pipeline breakdown */}
        <div className="fade-up-3" style={S.pipeCard}>
          <div style={S.sectionHead}>
            <span style={S.sectionTitle}>Pipeline Breakdown</span>
            <Link to="/leads" style={S.viewAll}>View all leads →</Link>
          </div>

          {/* Stacked bar */}
          <div style={S.stackBar}>
            {pipelineStages.map(s =>
              s.value > 0 ? (
                <div
                  key={s.label}
                  title={`${s.label}: ${s.value}`}
                  style={{
                    flex: s.value / pipeTotal,
                    background: s.color,
                    height: "100%",
                    borderRadius: "4px",
                    minWidth: "4px",
                    transition: "flex 0.5s ease",
                  }}
                />
              ) : null
            )}
          </div>

          {/* Legend */}
          <div style={S.legend}>
            {pipelineStages.map(s => (
              <div key={s.label} style={S.legendItem}>
                <span style={{ ...S.legendDot, background: s.color }} />
                <span style={S.legendLabel}>{s.label}</span>
                <span style={S.legendCount}>{s.value ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="fade-up-4" style={S.cta}>
          <Link to="/leads">
            <button style={S.ctaBtn}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Manage Leads →
            </button>
          </Link>
          <Link to="/create">
            <button style={S.ctaGhost}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--text-2)"; }}
            >
              + Add a Lead
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

function ValueCard({ label, value, color, sub }) {
  return (
    <div style={S.valCard}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-2)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <div style={S.valLabel}>{label}</div>
      <div style={{ ...S.valNum, color }}>{value}</div>
      <div style={S.valSub}>{sub}</div>
    </div>
  );
}

function Loading() {
  return (
    <>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{
          width: "36px", height: "36px",
          border: "3px solid var(--border-2)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
      </div>
    </>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    padding: "36px 32px 72px",
    maxWidth: "1300px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  h1: {
    fontFamily: "var(--font-d)",
    fontSize: "30px",
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.025em",
    marginBottom: "4px",
  },
  sub: { fontSize: "14px", color: "var(--text-2)" },
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
  grid5: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "14px",
    marginBottom: "16px",
  },
  statCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    padding: "22px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "border-color 0.2s",
  },
  statIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "var(--r-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: 700,
  },
  statNum: {
    fontFamily: "var(--font-d)",
    fontSize: "30px",
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },
  statLabel: { fontSize: "13px", color: "var(--text-2)", fontWeight: 500 },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "16px",
  },
  valCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    transition: "border-color 0.2s",
  },
  valLabel: { fontSize: "12.5px", fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em" },
  valNum: {
    fontFamily: "var(--font-d)",
    fontSize: "34px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
  },
  valSub: { fontSize: "12.5px", color: "var(--text-3)" },

  winCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  winLabel: { fontSize: "12.5px", fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em" },
  winNum: {
    fontFamily: "var(--font-d)",
    fontSize: "34px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
  },
  winBar: {
    height: "6px",
    background: "var(--bg-3)",
    borderRadius: "99px",
    overflow: "hidden",
  },
  winFill: {
    height: "100%",
    borderRadius: "99px",
    transition: "width 0.6s ease",
  },
  winSub: { fontSize: "12.5px", color: "var(--text-3)" },

  pipeCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    padding: "26px 28px",
    marginBottom: "24px",
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontFamily: "var(--font-d)",
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text)",
  },
  viewAll: {
    fontSize: "13px",
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 500,
  },
  stackBar: {
    display: "flex",
    gap: "4px",
    height: "12px",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "18px",
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  legendDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendLabel: { fontSize: "13px", color: "var(--text-2)" },
  legendCount: { fontSize: "13px", fontWeight: 600, color: "var(--text)" },

  cta: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  ctaBtn: {
    padding: "11px 24px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--r-sm)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.18s",
  },
  ctaGhost: {
    padding: "11px 24px",
    background: "var(--bg-3)",
    color: "var(--text-2)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.18s, color 0.18s",
  },
};