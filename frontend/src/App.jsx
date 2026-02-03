import { Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserPage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
