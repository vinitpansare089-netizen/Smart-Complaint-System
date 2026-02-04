import { Routes, Route, Navigate } from "react-router-dom";

import UserPage from "./pages/UserPage";
import Admin from "./pages/admin";
import AdminLogin from "./pages/AdminLogin";

function App() {

  const isLoggedIn = localStorage.getItem("adminToken");

  return (
    <Routes>

      {/* User */}
      <Route path="/" element={<UserPage />} />

      {/* Login */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Protected Admin */}
      <Route
        path="/admin"
        element={
          isLoggedIn
            ? <Admin />
            : <Navigate to="/admin-login" />
        }
      />

    </Routes>
  );
}

export default App;
