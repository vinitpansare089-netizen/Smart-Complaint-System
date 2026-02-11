// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
// } from "recharts";

// function AdminCharts({ complaints }) {

//   // Count by department
//   const stats = {};

//   complaints.forEach(c => {
//     stats[c.department] = (stats[c.department] || 0) + 1;
//   });

//   const data = Object.keys(stats).map(dep => ({
//     department: dep,
//     count: stats[dep]
//   }));

//   return (

//     <div style={{ height: 300 }}>

//       <h3>Complaints by Department</h3>

//       <ResponsiveContainer width="100%" height="100%">

//         <BarChart data={data}>

//           <XAxis dataKey="department" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="count" />

//         </BarChart>

//       </ResponsiveContainer>

//     </div>
//   );
// }

// export default AdminCharts;
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminCharts({ complaints = [] }) {
  // Guard: no data
  if (!complaints.length) {
    return (
      <div style={{ height: 300 }}>
        <h3>Complaints by Department</h3>
        <p>No complaints data available.</p>
      </div>
    );
  }

  // Count complaints by department
  const stats = complaints.reduce((acc, c) => {
    const dept = c.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(stats).map(([department, count]) => ({
    department,
    count,
  }));

  return (
    <div style={{ height: 300 }}>
      <h3>Complaints by Department</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="department" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AdminCharts;
