import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import { connectDB } from "./config/db.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

dotenv.config();
connectDB();



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notes", notesRoutes);


app.get("/", (req, res) => {
  res.send("CRM API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});