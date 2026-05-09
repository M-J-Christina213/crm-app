import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { pageStyle, card, input, buttonPrimary } from "../styles/ui";

export default function CreateLead() {
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/leads", formData);
    alert("Lead created!");
  };

  return (
    <>
      <Navbar />

      <div style={pageStyle}>
        <h1>Create Lead</h1>

        <div style={{ ...card, maxWidth: "600px" }}>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <input
                key={key}
                name={key}
                placeholder={key}
                value={formData[key]}
                onChange={handleChange}
                style={{ ...input, marginBottom: "10px" }}
              />
            ))}

            <button style={buttonPrimary} type="submit">
              Create Lead
            </button>
          </form>
        </div>
      </div>
    </>
  );
}