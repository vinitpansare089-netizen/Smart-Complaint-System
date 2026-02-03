
import { useEffect, useState } from "react";
import { fetchComplaints } from "../api";

function Admin() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints().then((data) => {
      setComplaints(data.complaints || []);
    });
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "auto" }}>
      <h1>Admin Dashboard</h1>
      <p>Authority View – Monitor & Act</p>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Student</th>
            <th>Department</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Urgency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td>{c.student_name}</td>
              <td>{c.department}</td>
              <td>{c.category}</td>
              <td>{c.priority}</td>
              <td>{c.urgency}</td>
              <td>{c.status || "Open"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
