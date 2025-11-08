// api.js

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express first — must come before using app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "your-mongodb-atlas-connection-string";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Schema and Model
const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  email: { type: String, required: true },
  username: { type: String }
});

const User = mongoose.model("User", userSchema);

// Routes

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Get user by id
app.get("/api/users/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

// Create new user
app.post("/api/users/newuser", async (req, res) => {
  try {
    const { id, email, username } = req.body;
    const newUser = new User({ id, email, username });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ error: "Error creating user", details: err.message });
  }
});

// Update user
app.put("/api/users/modify/:id", async (req, res) => {
  try {
    const { username } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { username },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
});

// Delete user
app.delete("/api/users/delete/:id", async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// (Optional) Get random user
app.get("/api/getrandomuser", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) return res.status(404).json({ error: "No users found" });
    const randomUser = users[Math.floor(Math.random() * users.length)];
    res.json(randomUser);
  } catch (err) {
    res.status(500).json({ error: "Error fetching random user" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("UserList API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
