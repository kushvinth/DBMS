// src/App.tsx
import { useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));

  return isLoggedIn ? (
    <AdminDashboard />
  ) : (
    <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  );
};

export default App;
