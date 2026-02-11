// import { useState } from "react";
// import axios from "axios";

// const API_URL = "https://smart-complaint-system-cd7z.onrender.com"; 

// function UserPage() {
//   const [form, setForm] = useState({
//     student_name: "",
//     department: "",
//     title: "",
//     description: "",
//   });

//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     console.log("Submitting form:", form);
//     const res = await axios.post(`${API_URL}/complaint`, form);
//     console.log("Response:", res.data);
//     setResult(res.data);
//   } catch (err) {
//     console.error("Submission error:", err);
//     alert("Failed to submit complaint");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div
//   style={{
//     maxWidth: "500px",
//     margin: "60px auto",
//     background: "white",
//     padding: "25px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
//   }}
// >

//       <h2>Smart Complaint System</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           name="student_name"
//           placeholder="Student Name"
//           onChange={handleChange}
//           required
//         />

//         <input
//           name="department"
//           placeholder="Department"
//           onChange={handleChange}
//           required
//         />

//         <input
//           name="title"
//           placeholder="Complaint Title"
//           onChange={handleChange}
//           required
//         />

//         <textarea
//           name="description"
//           placeholder="Describe your issue..."
//           onChange={handleChange}
//           required
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Submitting..." : "Submit Complaint"}
//         </button>
//       </form>

//     {result && (
//   <div style={{ marginTop: "30px" }}>
//     <h3>✅ Complaint Submitted</h3>

//     <p>
//       <b>Reference ID:</b> {result.reference_id}
//     </p>

//     {result.assigned_to && (
//       <p>
//         <b>Assigned To:</b>{" "}
//         {result.assigned_to.role} ({result.assigned_to.name})
//       </p>
//     )}

//     <p><b>Status:</b> Open</p>
//     <p>Please keep the reference ID for future communication.</p>
//   </div>
// )}



//     </div>
//   );
// }

// export default UserPage;


  import { useEffect, useState } from "react";
import "./UserPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function UserPage() {
  const [form, setForm] = useState({
    student_name: "",
    department: "",
    title: "",
    description: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     LOAD SAVED COMPLAINT ON REFRESH
  ========================= */
  useEffect(() => {
    const savedRef = localStorage.getItem("complaintRef");
    if (savedRef) {
      fetchComplaintStatus(savedRef);
    }
  }, []);

  const fetchComplaintStatus = async (refId) => {
    try {
      const res = await fetch(`${API_URL}/complaints/status/${refId}`);
      if (!res.ok) return;

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Status fetch error:", err);
    }
  };

  /* =========================
     SUBMIT COMPLAINT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/complaint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Submission failed");
      }

      const data = await res.json();

      // 🔑 SAVE reference ID for refresh persistence
      localStorage.setItem("complaintRef", data.reference_id);
      setResult(data);

      setForm({
        student_name: "",
        department: "",
        title: "",
        description: "",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>SC</div>
            <span style={styles.logoText}>Smart Complaint System</span>
          </div>
          <nav style={styles.nav}>
            <span style={styles.navItem}>Dashboard</span>
            <span style={styles.navItem}>Track</span>
            <span style={styles.navItemActive}>Submit</span>
          </nav>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div style={styles.gridContainer}>
        {/* Left Panel - Info Section */}
        <aside style={styles.leftPanel}>
          <div style={styles.infoCard}>
            <h2 style={styles.infoTitle}>Submit Your Complaint</h2>
            <p style={styles.infoText}>
              Our smart system automatically routes your complaint to the appropriate department for quick resolution.
            </p>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>24/7</div>
                <div style={styles.statLabel}>Support Available</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>48hrs</div>
                <div style={styles.statLabel}>Average Response</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>95%</div>
                <div style={styles.statLabel}>Resolution Rate</div>
              </div>
            </div>

            <div style={styles.features}>
              <h3 style={styles.featuresTitle}>How It Works</h3>
              <div style={styles.featureItem}>
                <div style={styles.featureNumber}>1</div>
                <div style={styles.featureContent}>
                  <div style={styles.featureTitle}>Fill the Form</div>
                  <div style={styles.featureDesc}>Provide details about your complaint</div>
                </div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureNumber}>2</div>
                <div style={styles.featureContent}>
                  <div style={styles.featureTitle}>Auto Assignment</div>
                  <div style={styles.featureDesc}>System assigns to relevant authority</div>
                </div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureNumber}>3</div>
                <div style={styles.featureContent}>
                  <div style={styles.featureTitle}>Get Resolution</div>
                  <div style={styles.featureDesc}>Track status with reference ID</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Panel - Form Section */}
        <main style={styles.rightPanel}>
          <div style={styles.formSection}>
            <div style={styles.formCard}>
              <h1 style={styles.formTitle}>New Complaint</h1>
              <p style={styles.formSubtitle}>All fields are required</p>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Student Name</label>
                    <input
                      name="student_name"
                      placeholder="Enter your full name"
                      value={form.student_name}
                      onChange={handleChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Department</label>
                    <input
                      name="department"
                      placeholder="e.g., Computer Science"
                      value={form.department}
                      onChange={handleChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Complaint Title</label>
                  <input
                    name="title"
                    placeholder="Brief summary of your issue"
                    value={form.title}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    placeholder="Provide detailed information about your complaint..."
                    value={form.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    rows="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.button,
                    ...(loading ? styles.buttonDisabled : {}),
                  }}
                >
                  {loading ? (
                    <span style={styles.buttonContent}>
                      <span style={styles.spinner}></span>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Complaint"
                  )}
                </button>
              </form>

              {error && (
                <div style={styles.alert}>
                  <svg style={styles.alertIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div style={styles.successCard}>
                  <div style={styles.successHeader}>
                    <svg style={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 style={styles.successTitle}>Complaint Submitted</h3>
                  </div>

                  <div style={styles.resultGrid}>
                    <div style={styles.resultBox}>
                      <div style={styles.resultLabel}>Reference ID</div>
                      <div style={styles.resultValue}>{result.reference_id}</div>
                    </div>

                    {result.assigned_to && (
                      <div style={styles.resultBox}>
                        <div style={styles.resultLabel}>Assigned To</div>
                        <div style={styles.resultValue}>
                          {result.assigned_to.role}
                          <div style={styles.assignedName}>({result.assigned_to.name})</div>
                        </div>
                      </div>
                    )}

                    <div style={styles.resultBox}>
                      <div style={styles.resultLabel}>Status</div>
                      <span style={styles.statusBadge}>Open</span>
                    </div>
                  </div>

                  <p style={styles.note}>
                    Save your reference ID for tracking and future communication.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  header: {
    background: "linear-gradient(135deg, #002fff 0%, #00fdd3 50%, #000000 100%)",
    padding: "0 40px",
    boxShadow: "0 2px 8px rgba(0, 47, 255, 0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    backdropFilter: "blur(10px)",
  },
  logoText: {
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "-0.3px",
  },
  nav: {
    display: "flex",
    gap: "32px",
  },
  navItem: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  navItemActive: {
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    borderBottom: "2px solid rgba(255, 255, 255, 0.8)",
    paddingBottom: "4px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "450px 1fr",
    flex: 1,
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
    gap: "0",
    overflow: "hidden",
  },
  leftPanel: {
    background: "linear-gradient(135deg, #002fff 0%, #00fdd3 50%, #000000 100%)",
    padding: "60px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflowY: "auto",
  },
  infoCard: {
    color: "white",
  },
  infoTitle: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 16px 0",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  infoText: {
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 40px 0",
    opacity: "0.95",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "48px",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "20px 16px",
    borderRadius: "12px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  statNumber: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "6px",
    background: "linear-gradient(135deg, #002fff 0%, #00fdd3 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  statLabel: {
    fontSize: "12px",
    opacity: "0.9",
    lineHeight: "1.3",
  },
  features: {
    marginTop: "24px",
  },
  featuresTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "24px",
    opacity: "0.95",
  },
  featureItem: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    alignItems: "flex-start",
  },
  featureNumber: {
    width: "36px",
    height: "36px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    flexShrink: 0,
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  featureDesc: {
    fontSize: "14px",
    opacity: "0.85",
    lineHeight: "1.4",
  },
  rightPanel: {
    background: "#ffffff",
    padding: "60px 40px",
    overflowY: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formSection: {
    width: "100%",
    maxWidth: "600px",
  },
  formCard: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0, 47, 255, 0.1)",
  },
  formTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#718096",
    margin: "0 0 32px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
    letterSpacing: "0.2px",
  },
  input: {
    padding: "14px 18px",
    fontSize: "15px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  inputFocus: {
    borderColor: "#002fff",
    boxShadow: "0 0 0 3px rgba(0, 47, 255, 0.1)",
  },
  textarea: {
    padding: "14px 18px",
    fontSize: "15px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    resize: "vertical",
    backgroundColor: "#ffffff",
    lineHeight: "1.6",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  button: {
    padding: "16px 28px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #002fff 0%, #00fdd3 50%, #000000 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "12px",
    letterSpacing: "0.5px",
    boxShadow: "0 8px 24px rgba(0, 47, 255, 0.3)",
  },
  buttonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 32px rgba(0, 47, 255, 0.4)",
  },
  buttonDisabled: {
    opacity: "0.7",
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "0 4px 12px rgba(0, 47, 255, 0.2)",
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  alert: {
    marginTop: "20px",
    padding: "16px 20px",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color: "#dc2626",
  },
  alertIcon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
  },
  successCard: {
    marginTop: "32px",
    padding: "28px",
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    border: "2px solid #86efac",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(34, 197, 94, 0.15)",
  },
  successHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "24px",
  },
  successIcon: {
    width: "28px",
    height: "28px",
    color: "#22c55e",
    flexShrink: 0,
  },
  successTitle: {
    margin: "0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#166534",
    letterSpacing: "-0.3px",
  },
  resultGrid: {
    display: "grid",
    gap: "14px",
    marginBottom: "20px",
  },
  resultBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  resultLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  resultValue: {
    fontSize: "15px",
    color: "#1f2937",
    fontWeight: "600",
    textAlign: "right",
  },
  assignedName: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "400",
    marginTop: "4px",
  },
  statusBadge: {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#065f46",
    background: "#d1fae5",
    borderRadius: "20px",
    boxShadow: "0 2px 8px rgba(34, 197, 94, 0.2)",
  },
  note: {
    margin: "20px 0 0 0",
    fontSize: "14px",
    color: "#059669",
    lineHeight: "1.6",
    fontStyle: "italic",
    fontWeight: "500",
  },
};

export default UserPage;
