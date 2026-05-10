// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV = [
  { to: "/app",    label: "Dashboard", icon: "▦" },
  { to: "/leads",  label: "Leads",     icon: "◈" },
  { to: "/create", label: "New Lead",  icon: "＋" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={S.nav}>
      {/* Brand */}
      <Link to="/app" style={S.brand}>
        <span style={S.brandMark}>◈</span>
        <span style={S.brandName}>PipeFlow</span>
      </Link>

      <div style={S.divider} />

      {/* Links */}
      <div style={S.links}>
        {NAV.map(({ to, label, icon }) => {
          const active = pathname === to || (to !== "/app" && pathname.startsWith(to));
          return (
            <Link key={to} to={to} style={{ textDecoration: "none" }}>
              <div style={{ ...S.link, ...(active ? S.linkActive : {}) }}>
                <span style={S.linkIcon}>{icon}</span>
                {label}
                {active && <span style={S.pip} />}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Right */}
      <div style={S.right}>
        <div style={S.avatarWrap}>
          <div style={S.avatar}>A</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Admin</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-3)" }}>admin@example.com</div>
          </div>
        </div>
        <button
          onClick={logout}
          style={S.logoutBtn}
          onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}

const S = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "0 28px",
    height: "60px",
    background: "var(--bg-2)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 200,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    textDecoration: "none",
    marginRight: "8px",
  },
  brandMark: {
    fontSize: "22px",
    color: "var(--accent)",
    lineHeight: 1,
  },
  brandName: {
    fontFamily: "var(--font-d)",
    fontWeight: 800,
    fontSize: "18px",
    color: "var(--text)",
    letterSpacing: "-0.025em",
  },
  divider: {
    width: "1px",
    height: "22px",
    background: "var(--border-2)",
    margin: "0 16px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    flex: 1,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 13px",
    borderRadius: "var(--r-sm)",
    fontSize: "13.5px",
    fontWeight: 500,
    color: "var(--text-2)",
    cursor: "pointer",
    position: "relative",
    transition: "color 0.15s, background 0.15s",
  },
  linkActive: {
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid var(--border)",
  },
  linkIcon: { fontSize: "14px", lineHeight: 1 },
  pip: {
    position: "absolute",
    bottom: "-1px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "18px",
    height: "2px",
    background: "var(--accent)",
    borderRadius: "99px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginLeft: "auto",
  },
  avatarWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--accent), #7c3aed)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid var(--border-2)",
    color: "var(--text-2)",
    padding: "6px 14px",
    borderRadius: "var(--r-sm)",
    fontSize: "13px",
    cursor: "pointer",
    transition: "color 0.15s, border-color 0.15s",
  },
};