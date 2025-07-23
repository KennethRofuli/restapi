import React, { useState, useEffect } from "react";

const API_URL = "https://kenrofuli-testapi.onrender.com/api/users"; // Change to your deployed URL if needed

function App() {
  const [form, setForm] = useState({ id: "", email: "", username: "" });
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    setUsers(data);
  } catch {
    setUsers([]);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  try {
    const res = await fetch("https://kenrofuli-testapi.onrender.com/api/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.text();
    console.log("Response:", result);
    if (res.ok) {
      setMessage("User added successfully!");
      setForm({ id: "", email: "", username: "" });
      fetchUsers();
    } else {
      setMessage("Error: " + result);
    }
  } catch (err) {
    setMessage("Network error");
    console.error(err);
  }
};

const handleDelete = async (id) => {
  setMessage("");
  try {
    const res = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("User deleted!");
      fetchUsers();
    } else {
      const err = await res.json();
      setMessage("Error: " + (err.error || "Unknown error"));
    }
  } catch (err) {
    setMessage("Network error");
  }
};

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc" }}>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input name="id" type="number" value={form.id} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Username:</label>
          <input name="username" value={form.username} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Add User</button>
      </form>
      {message && <p>{message}</p>}

      <h3 style={{ marginTop: 30 }}>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <b>Email:</b> {user.email}, <b>Username:</b> {user.username}
            <button
              style={{ marginLeft: 10 }}
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;