import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000"; // change after deployment

function UserPage() {
  const [form, setForm] = useState({
    student_name: "",
    department: "",
    title: "",
    description: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    console.log("Submitting form:", form);
    const res = await axios.post(`${API_URL}/complaint`, form);
    console.log("Response:", res.data);
    setResult(res.data);
  } catch (err) {
    console.error("Submission error:", err);
    alert("Failed to submit complaint");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Smart Complaint System</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="student_name"
          placeholder="Student Name"
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          onChange={handleChange}
          required
        />

        <input
          name="title"
          placeholder="Complaint Title"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Describe your issue..."
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

    {result && (
  <div style={{ marginTop: "30px" }}>
    <h3>✅ Complaint Submitted</h3>

    <p>
      <b>Reference ID:</b> {result.reference_id}
    </p>

    {result.assigned_to && (
      <p>
        <b>Assigned To:</b>{" "}
        {result.assigned_to.role} ({result.assigned_to.name})
      </p>
    )}

    <p><b>Status:</b> Open</p>
    <p>Please keep the reference ID for future communication.</p>
  </div>
)}



    </div>
  );
}

export default UserPage;
