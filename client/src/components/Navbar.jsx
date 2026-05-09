import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 25px",
        background: "#0f172a",
        color: "white",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>CRM System</h2>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link style={{ color: "white" }} to="/app">
          Dashboard
        </Link>

        <Link style={{ color: "white" }} to="/leads">
          Leads
        </Link>

        <Link style={{ color: "white" }} to="/create">
          Create
        </Link>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}