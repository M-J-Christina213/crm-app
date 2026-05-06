import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@example.com" && password === "password123") {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

export default router;