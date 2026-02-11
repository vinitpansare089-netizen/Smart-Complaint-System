// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   async function handleLogin(e) {
//   e.preventDefault();

//   try {
//     const res = await fetch("http://localhost:8000/admin/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });

//     const data = await res.json();

//     console.log("LOGIN RESPONSE:", data); // 👈 DEBUG

//     if (data.success) {
//   localStorage.setItem("adminToken", data.token);

//   // Force reload + redirect (more reliable)
//   window.location.href = "/admin";
// }
//  else {
//       alert("Invalid login");
//     }

//   } catch (err) {
//     console.error("Login error:", err);
//     alert("Server error");
//   }
// }


//   return (
//     <div
//       style={{
//         width: "350px",
//         margin: "120px auto",
//         background: "white",
//         padding: "25px",
//         borderRadius: "10px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
//       }}
//     >
//       <h2>Admin Login</h2>

//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           required
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <br /><br />

//         <input
//           type="password"
//           placeholder="Password"
//           required
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <br /><br />

//         <button>Login</button>
//       </form>
//     </div>
//   );
// }

// export default AdminLogin;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("FULL LOGIN RESPONSE 👉", data);

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token =
        data.token ||
        data.accessToken ||
        data.jwt ||
        data?.data?.token;

      if (!token) {
        throw new Error("Token not received from backend");
      }

      localStorage.setItem("adminToken", token);
      navigate("/admin", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email/password or server issue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #002fff 0%, #00fdd3 50%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: float 6s ease-in-out infinite;
        }

        .login-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .login-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          color: #718096;
          font-size: 15px;
          margin: 0;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
          letter-spacing: 0.3px;
        }

        .login-input {
          padding: 14px 18px;
          font-size: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
          background: #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .login-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15), 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .login-button {
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #002fff 0%, #00fdd3 50%, #000000 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .error-message {
          margin-top: 20px;
          padding: 16px;
          background: #fff5f5;
          border: 1px solid #fc8181;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #c53030;
          animation: fadeInUp 0.3s ease-out;
        }

        .error-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .login-card {
            margin: 20px;
            padding: 36px 28px;
          }
          
          .login-title {
            font-size: 28px;
          }
          
          .login-input, .login-button {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Admin Login</h1>
            <p className="login-subtitle">Enter your credentials to access the admin panel</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="login-input"
                placeholder="admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              <span className="login-button-content">
                {loading && <div className="spinner"></div>}
                {loading ? "Logging in..." : "Sign In"}
              </span>
            </button>
          </form>

          {error && (
            <div className="error-message">
              <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
