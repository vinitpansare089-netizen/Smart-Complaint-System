import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function AdminCharts({ complaints }) {

  // Count by department
  const stats = {};

  complaints.forEach(c => {
    stats[c.department] = (stats[c.department] || 0) + 1;
  });

  const data = Object.keys(stats).map(dep => ({
    department: dep,
    count: stats[dep]
  }));

  return (

    <div style={{ height: 300 }}>

      <h3>Complaints by Department</h3>

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data}>

          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default AdminCharts;
