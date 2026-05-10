// src/pages/Login.jsx
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/app");
    } catch {
      setError("Invalid credentials. Try admin@example.com / password123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      {/* dot-grid background */}
      <div style={S.dots} />
      {/* blue glow */}
      <div style={S.glow} />

      <div className="fade-up" style={S.wrap}>
        {/* Logo */}
        <div style={S.logo}>
          <span style={S.logoIcon}>◈</span>
          <span style={S.logoText}>PipeFlow</span>
        </div>

        <div style={S.card}>
          <div style={S.cardTop}>
            <h1 style={S.title}>Welcome back</h1>
            <p style={S.sub}>Sign in to your sales workspace</p>
          </div>

          {error && <div style={S.err}>{error}</div>}

          <form onSubmit={handleLogin}>
            <Field label="Email address">
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={S.input}
                required
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={S.input}
                required
              />
            </Field>

            <button
              type="submit"
              style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <p style={S.hint}>
            Demo&nbsp;
            <code style={S.code}>admin@example.com</code>
            &nbsp;/&nbsp;
            <code style={S.code}>password123</code>
          </p>
        </div>

        <p style={S.footer}>© 2025 PipeFlow · Lead management for high-velocity teams</p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block",
        fontSize: "12.5px",
        fontWeight: 500,
        color: "var(--text-2)",
        marginBottom: "7px",
        letterSpacing: "0.03em",
        textTransform: "uppercase",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  dots: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    top: "-200px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "700px",
    height: "700px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,127,255,0.10) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  wrap: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "28px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "30px",
    color: "var(--accent)",
    lineHeight: 1,
  },
  logoText: {
    fontFamily: "var(--font-d)",
    fontWeight: 800,
    fontSize: "28px",
    color: "var(--text)",
    letterSpacing: "-0.03em",
  },
  card: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-xl)",
    padding: "38px 34px 30px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
  },
  cardTop: {
    marginBottom: "30px",
  },
  title: {
    fontFamily: "var(--font-d)",
    fontSize: "26px",
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.025em",
    marginBottom: "6px",
  },
  sub: {
    fontSize: "14px",
    color: "var(--text-2)",
  },
  err: {
    background: "var(--red-bg)",
    border: "1px solid rgba(255,91,110,0.22)",
    color: "var(--red)",
    padding: "12px 16px",
    borderRadius: "var(--r-sm)",
    fontSize: "13.5px",
    marginBottom: "22px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    background: "var(--bg-3)",
    border: "1px solid var(--border-2)",
    borderRadius: "var(--r-sm)",
    color: "var(--text)",
    fontSize: "14.5px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  btn: {
    marginTop: "6px",
    width: "100%",
    padding: "13px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--r-sm)",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "opacity 0.2s",
  },
  hint: {
    marginTop: "22px",
    fontSize: "12.5px",
    color: "var(--text-3)",
    textAlign: "center",
    lineHeight: 1.8,
  },
  code: {
    background: "var(--bg-3)",
    padding: "2px 7px",
    borderRadius: "4px",
    color: "var(--text-2)",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  footer: {
    fontSize: "12px",
    color: "var(--text-3)",
    textAlign: "center",
  },
};