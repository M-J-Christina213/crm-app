import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { pageStyle, card, input, buttonPrimary } from "../styles/ui";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    navigate("/app");
  };

  return (
    <div
      style={{
        ...pageStyle,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ ...card, width: "350px" }}>
        <h2>CRM Login</h2>

        <form onSubmit={handleLogin}>
          <input
            style={input}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <br /><br />

          <input
            style={input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <br /><br />

          <button style={buttonPrimary} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}