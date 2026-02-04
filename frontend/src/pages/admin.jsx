import { useEffect, useState } from "react";
import { fetchComplaints, updateStatus } from "../api";
import AdminCharts from "./AdminCharts";
import AdminAnalytics from "./AdminAnalytics";



function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null); // for details popup

  // Load complaints
  const loadComplaints = async () => {
    const data = await fetchComplaints();
    setComplaints(data.complaints || []);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Update status
  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    loadComplaints(); // refresh list
  };

  return (

    <div style={{ maxWidth: "1200px", margin: "auto" }}>
      <h3>Welcome, Admin 👋</h3>
      <h1>Admin Dashboard</h1>
      <p>Authority View – Monitor & Act</p>
      
      <button
  onClick={() => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  }}
  style={{ float: "right" }}
>
  Logout
</button>


<AdminAnalytics complaints={complaints} />
<hr />

      {/* TABLE */}
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Student</th>
            <th>Dept</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.student_name}</td>
              <td>{c.department}</td>
              <td>{c.category}</td>
              <td>{c.priority}</td>
              <td>{c.urgency}</td>

              {/* STATUS */}
              <td>{c.status}</td>

              {/* CONTROL */}
              <td>
                <select
                  value={c.status}
                  onChange={(e) =>
                    handleStatusChange(c.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>In Process</option>
                  <option>Resolved</option>
                </select>
              </td>

              {/* DETAILS BUTTON */}
              <td>
                <button onClick={() => setSelected(c)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DETAILS MODAL */}
      {selected && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "20%",
            width: "60%",
            background: "white",
            border: "2px solid black",
            padding: "20px",
            zIndex: 999,
          }}
        >
          <h2>Complaint Details</h2>

          <p><b>ID:</b> {selected.id}</p>
          <p><b>Reference:</b> {selected.reference_id}</p>
          <p><b>Name:</b> {selected.student_name}</p>
          <p><b>Department:</b> {selected.department}</p>
          <p><b>Title:</b> {selected.title}</p>
          <p><b>Description:</b> {selected.description}</p>

          <p><b>Category:</b> {selected.category}</p>
          <p><b>Priority:</b> {selected.priority}</p>
          <p><b>Urgency:</b> {selected.urgency}</p>
          <p><b>Emotion:</b> {selected.emotion}</p>

          <p>
            <b>Risk:</b>{" "}
            {selected.emerging_risk?.detected ? "YES 🚨" : "NO"}
          </p>

          <p>
            <b>Assigned:</b>{" "}
            {selected.assigned_to?.name}
          </p>

          <p><b>Status:</b> {selected.status}</p>
          <p><b>Created:</b> {selected.created_at}</p>

          <button onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Admin;

