import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data); // 👈 DEBUG

    if (data.success) {
  localStorage.setItem("adminToken", data.token);

  // Force reload + redirect (more reliable)
  window.location.href = "/admin";
}
 else {
      alert("Invalid login");
    }

  } catch (err) {
    console.error("Login error:", err);
    alert("Server error");
  }
}


  return (
    <div
      style={{
        width: "350px",
        margin: "120px auto",
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
