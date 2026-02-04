import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

function AdminAnalytics({ complaints }) {

  /* ---------- Category Stats ---------- */
  const categoryMap = {};
  complaints.forEach(c => {
    categoryMap[c.category] =
      (categoryMap[c.category] || 0) + 1;
  });

  const categoryData = Object.keys(categoryMap).map(k => ({
    name: k,
    value: categoryMap[k]
  }));

  /* ---------- Department Stats ---------- */
  const deptMap = {};
  complaints.forEach(c => {
    deptMap[c.department] =
      (deptMap[c.department] || 0) + 1;
  });

  const deptData = Object.keys(deptMap).map(k => ({
    name: k,
    count: deptMap[k]
  }));

  /* ---------- Last 24 Hours Trend ---------- */
  const last24 = complaints.filter(c => {
    if (!c.created_at) return false;

    const time = new Date(c.created_at).getTime();
    return Date.now() - time <= 24 * 60 * 60 * 1000;
  });

  const trendMap = {};
  last24.forEach(c => {
    trendMap[c.category] =
      (trendMap[c.category] || 0) + 1;
  });

  const trendData = Object.keys(trendMap).map(k => ({
    category: k,
    count: trendMap[k]
  }));

  return (
  <div style={{ padding: "20px" }}>

    <h2>📊 Complaint Analytics</h2>

    {/* GRID */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}
    >

      {/* CATEGORY */}
      <div className="card">
        <h4>By Category</h4>

        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {categoryData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* DEPARTMENT */}
      <div className="card">
        <h4>By Department</h4>

        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* TREND */}
      <div className="card">
        <h4>Last 24 Hours Trend</h4>

        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  </div>
);


}

export default AdminAnalytics;
