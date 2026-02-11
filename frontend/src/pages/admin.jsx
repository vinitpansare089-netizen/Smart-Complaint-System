// import { useEffect, useState } from "react";
// import { fetchComplaints, updateStatus } from "../api";
// import AdminCharts from "./AdminCharts";
// import AdminAnalytics from "./AdminAnalytics";



// function Admin() {
//   const [complaints, setComplaints] = useState([]);
//   const [selected, setSelected] = useState(null); // for details popup

//   // Load complaints
//   const loadComplaints = async () => {
//     const data = await fetchComplaints();
//     setComplaints(data.complaints || []);
//   };

//   useEffect(() => {
//     loadComplaints();
//   }, []);

//   // Update status
//   const handleStatusChange = async (id, status) => {
//     await updateStatus(id, status);
//     loadComplaints(); // refresh list
//   };

//   return (

//     <div style={{ maxWidth: "1200px", margin: "auto" }}>
//       <h3>Welcome, Admin 👋</h3>
//       <h1>Admin Dashboard</h1>
//       <p>Authority View – Monitor & Act</p>
      
//       <button
//   onClick={() => {
//     localStorage.removeItem("adminToken");
//     window.location.href = "/admin-login";
//   }}
//   style={{ float: "right" }}
// >
//   Logout
// </button>


// <AdminAnalytics complaints={complaints} />
// <hr />

//       {/* TABLE */}
//       <table border="1" cellPadding="8" width="100%">
//         <thead>
//           <tr>
//             <th>Student</th>
//             <th>Dept</th>
//             <th>Category</th>
//             <th>Priority</th>
//             <th>Urgency</th>
//             <th>Status</th>
//             <th>Action</th>
//             <th>Details</th>
//           </tr>
//         </thead>

//         <tbody>
//           {complaints.map((c) => (
//             <tr key={c.id}>
//               <td>{c.student_name}</td>
//               <td>{c.department}</td>
//               <td>{c.category}</td>
//               <td>{c.priority}</td>
//               <td>{c.urgency}</td>

//               {/* STATUS */}
//               <td>{c.status}</td>

//               {/* CONTROL */}
//               <td>
//                 <select
//                   value={c.status}
//                   onChange={(e) =>
//                     handleStatusChange(c.id, e.target.value)
//                   }
//                 >
//                   <option>Pending</option>
//                   <option>In Process</option>
//                   <option>Resolved</option>
//                 </select>
//               </td>

//               {/* DETAILS BUTTON */}
//               <td>
//                 <button onClick={() => setSelected(c)}>
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* DETAILS MODAL */}
//       {selected && (
//         <div
//           style={{
//             position: "fixed",
//             top: "10%",
//             left: "20%",
//             width: "60%",
//             background: "white",
//             border: "2px solid black",
//             padding: "20px",
//             zIndex: 999,
//           }}
//         >
//           <h2>Complaint Details</h2>

//           <p><b>ID:</b> {selected.id}</p>
//           <p><b>Reference:</b> {selected.reference_id}</p>
//           <p><b>Name:</b> {selected.student_name}</p>
//           <p><b>Department:</b> {selected.department}</p>
//           <p><b>Title:</b> {selected.title}</p>
//           <p><b>Description:</b> {selected.description}</p>

//           <p><b>Category:</b> {selected.category}</p>
//           <p><b>Priority:</b> {selected.priority}</p>
//           <p><b>Urgency:</b> {selected.urgency}</p>
//           <p><b>Emotion:</b> {selected.emotion}</p>

//           <p>
//             <b>Risk:</b>{" "}
//             {selected.emerging_risk?.detected ? "YES 🚨" : "NO"}
//           </p>

//           <p>
//             <b>Assigned:</b>{" "}
//             {selected.assigned_to?.name}
//           </p>

//           <p><b>Status:</b> {selected.status}</p>
//           <p><b>Created:</b> {selected.created_at}</p>

//           <button onClick={() => setSelected(null)}>
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Admin;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchComplaints, updateStatus } from "../api";
import AdminCharts from "./AdminCharts";
import AdminAnalytics from "./AdminAnalytics";

function Admin() {
const [complaints, setComplaints] = useState([]);
const [selected, setSelected] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [filterStatus, setFilterStatus] = useState("all");

const navigate = useNavigate();

/* =========================
AUTH GUARD
========================= */
useEffect(() => {
const token = localStorage.getItem("adminToken");
if (!token) {
navigate("/admin-login", { replace: true });
}
}, [navigate]);

/* =========================
LOAD COMPLAINTS
========================= */
const loadComplaints = async () => {
try {
setLoading(true);
const data = await fetchComplaints();
setComplaints(data.complaints || []);
} catch (err) {
console.error("Fetch error:", err);
setError("Failed to load complaints");
} finally {
setLoading(false);
}
};

useEffect(() => {
loadComplaints();
}, []);

/* =========================
UPDATE STATUS
========================= */
const handleStatusChange = async (id, status) => {
try {
await updateStatus(id, status);
loadComplaints();
} catch (err) {
console.error("Update error:", err);
alert("Failed to update status");
}
};

/* =========================
LOGOUT
========================= */
const handleLogout = () => {
localStorage.removeItem("adminToken");
navigate("/admin-login", { replace: true });
};

const filteredComplaints = complaints.filter(c =>
filterStatus === "all" || c.status === filterStatus
);

const getUrgencyColor = (urgency) => {
if (urgency >= 8) return { bg: '#ef4444', color: 'white' };
if (urgency >= 6) return { bg: '#f59e0b', color: 'white' };
if (urgency >= 4) return { bg: '#10b981', color: 'white' };
return { bg: '#6b7280', color: 'white' };
};

const LoadingComponent = () => (
<div className="loading-container">
<div className="spinner"></div>
<p>Loading dashboard...</p>
</div>
);

const ErrorComponent = ({ onRetry }) => (
<div className="error-container">
<div className="error-icon">!</div>
<p>{error}</p>
<button className="retry-btn" onClick={onRetry}>Retry</button>
</div>
);

if (loading) return <LoadingComponent />;
if (error) return <ErrorComponent onRetry={loadComplaints} />;

return (
<>


<style>{`
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
}

.admin-dashboard {
  min-height: 100vh;
  background: #ffffff;
  color: #e5e7eb;
}

/* HEADER */
.dashboard-header {
  background: #ffffff;
  padding: 20px 32px;
  border-bottom: 1px solid #1e293b;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.welcome-text {
  color: #94a3b8;
  font-size: 14px;
}

.logout-btn {
  background: #dc2626;
  border: none;
  color: white;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

/* MAIN */
.main-content {
  padding: 32px;
  max-width: 1400px;
  margin: auto;
}

/* FILTER + COUNT */
.complaints-overview {
  background: #f8fafc;
  color: #0f172a;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-select {
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #cbd5f5;
}

.complaints-count-white {
  font-size: 22px;
  font-weight: 700;
}

/* CARDS */
.chart-card,
.table-container {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  color: #0f172a;
}

/* TABLE */
.complaints-table {
  width: 100%;
  border-collapse: collapse;
}

.complaints-table th {
  text-align: left;
  padding: 14px;
  font-size: 12px;
  text-transform: uppercase;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.complaints-table td {
  padding: 14px;
  border-bottom: 1px solid #e2e8f0;
}

.complaints-table tr:hover {
  background: #f1f5f9;
}

/* BADGES */
.status-badge {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 999px;
  font-weight: 600;
}

.status-pending { background: #fef3c7; color: #92400e; }
.status-in-process { background: #dbeafe; color: #1e40af; }
.status-resolved { background: #dcfce7; color: #166534; }

.urgency-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

/* ACTIONS */
.status-select,
.action-btn {
  width: 100%;
  padding: 8px;
  margin-top: 6px;
}

.action-btn {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* MODAL */
.modal-overlay {
  background: rgba(2,6,23,0.7);
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-card {
  background: #f8fafc;
  color: #0f172a;
  width: 95%;
  max-width: 1100px;
  border-radius: 12px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

/* DETAILS */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
  gap: 16px;
  padding: 20px;
}

.detail-item {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2563eb;
}

.detail-label {
  font-size: 12px;
  color: #64748b;
}

.detail-value {
  font-weight: 600;
}

/* DESCRIPTION */
.full-width-desc {
  padding: 20px;
}

.desc-content {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  margin-top: 10px;
}
`}</style>


<div className="admin-dashboard">
{/* Header */}
<header className="dashboard-header">
<div className="header-content">
<div>
<h1 className="dashboard-title">Admin Dashboard</h1>
<p className="welcome-text">Monitor & Resolve Complaints Efficiently</p>
</div>
<div className="header-actions">
<button className="logout-btn" onClick={handleLogout}>
Logout
</button>
</div>
</div>
</header>

{/* Main Content */}
<main className="main-content">
{/* 1. Counter */}
<div className="complaints-overview">
<select
className="filter-select"
value={filterStatus}
onChange={(e) => setFilterStatus(e.target.value)}
>
<option value="all">All Status ({complaints.length})</option>
<option value="Pending">Pending</option>
<option value="In Process">In Process</option>
<option value="Resolved">Resolved</option>
</select>
<div className="complaints-counter-container">
<h2 className="complaints-count-white">
{filteredComplaints.length} Complaints
</h2>
</div>
</div>

{/* 2. Charts 2x2 */}
<div className="charts-grid">
<AdminAnalytics complaints={complaints} />
<AdminCharts complaints={filteredComplaints} />
</div>

{/* 3. Table */}
<div className="complaints-grid">
<div className="table-container">
<div className="table-header"></div>
<div className="table-wrapper">
<table className="complaints-table">
<thead>
<tr>
<th>Student</th>
<th>Department</th>
<th>Category</th>
<th>Priority</th>
<th>Urgency</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>
<tbody>
{filteredComplaints.length ? (
filteredComplaints.map((c) => (
<tr key={c.id}>
<td>
<strong>{c.student_name}</strong>
<br />
<small style={{color: '#94a3b8'}}>{c.reference_id}</small>
</td>
<td>{c.department || 'N/A'}</td>
<td>{c.category || 'N/A'}</td>
<td>{c.priority || 'N/A'}</td>
<td>
<span
className="urgency-badge"
style={{
backgroundColor: getUrgencyColor(c.urgency || 0).bg,
color: getUrgencyColor(c.urgency || 0).color
}}
>
{c.urgency || 0}/10
</span>
</td>
<td>
<span
className={`status-badge status-${c.status?.toLowerCase().replace(' ', '-') || 'pending'}`}
>
{c.status || 'Pending'}
</span>
</td>
<td>
<select
className="status-select"
value={c.status || 'Pending'}
onChange={(e) => handleStatusChange(c.id, e.target.value)}
>
<option>Pending</option>
<option>In Process</option>
<option>Resolved</option>
</select>
<br />
<button
className="action-btn"
onClick={() => setSelected(c)}
>
View Details
</button>
</td>
</tr>
))
) : (
<tr>
<td colSpan="7" style={{textAlign: 'center', padding: '80px'}}>
<p style={{color: '#94a3b8', fontSize: '18px'}}>
No complaints found for selected filter
</p>
</td>
</tr>
)}
</tbody>
</table>
</div>
</div>
</div>
</main>
</div>

{/* FULL MODAL WITH ALL FIELDS */}
{selected && (
<div className="modal-overlay" onClick={() => setSelected(null)}>
<div className="modal-card" onClick={(e) => e.stopPropagation()}>
<div className="modal-header">
<h2 className="modal-title">Complaint Details</h2>
<button className="close-btn" onClick={() => setSelected(null)}>×</button>
</div>

<div className="detail-grid">
<div className="detail-item">
<div className="detail-label">Reference ID</div>
<div className="detail-value">{selected.reference_id}</div>
</div>
<div className="detail-item">
<div className="detail-label">Student Name</div>
<div className="detail-value">{selected.student_name}</div>
</div>
<div className="detail-item">
<div className="detail-label">Department</div>
<div className="detail-value">{selected.department || 'N/A'}</div>
</div>
<div className="detail-item">
<div className="detail-label">Category</div>
<div className="detail-value">{selected.category || 'N/A'}</div>
</div>
<div className="detail-item">
<div className="detail-label">Priority</div>
<div className="detail-value">{selected.priority || 'N/A'}</div>
</div>
<div className="detail-item">
<div className="detail-label">Urgency Score</div>
<h3 className="urgency-score" style={{
color: getUrgencyColor(selected.urgency || 0).bg,
margin: 0
}}>
{selected.urgency || 0}/10
</h3>
</div>
<div className="detail-item">
<div className="detail-label">Emotion</div>
<div className="detail-value">{selected.emotion || 'N/A'}</div>
</div>
<div className="detail-item">
<div className="detail-label">Status</div>
<div className="detail-value">
<span className={`status-badge status-${selected.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
{selected.status || 'Pending'}
</span>
</div>
</div>
{selected.assigned_to && (
<div className="detail-item">
<div className="detail-label">Assigned To</div>
<div className="detail-value">
{selected.assigned_to.role} ({selected.assigned_to.name})
</div>
</div>
)}
{selected.created_at && (
<div className="detail-item">
<div className="detail-label">Created</div>
<div className="detail-value">
{new Date(selected.created_at).toLocaleString()}
</div>
</div>
)}
{selected.emerging_risk && (
<div className="detail-item">
<div className="detail-label">Risk Detected</div>
<div className="detail-value">
<span className={`risk-badge risk-${selected.emerging_risk.detected ? 'yes' : 'no'}`}>
{selected.emerging_risk.detected ? 'YES' : 'NO'}
</span>
</div>
</div>
)}
</div>

{/* FULL WIDTH TITLE + DESCRIPTION */}
<div className="full-width-desc">
<div className="detail-label">Title</div>
<h3 className="desc-title">{selected.title}</h3>
<div className="detail-label">Description</div>
<div className="desc-content">
{selected.description || 'No description provided.'}
</div>
</div>
</div>
</div>
)}
</>
);
}

export default Admin; 
