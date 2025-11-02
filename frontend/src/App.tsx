// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageStudents from "./pages/ManageStudents";
import PerformanceSummary from "./pages/PerformanceSummary";
import PlacementPrediction from "./pages/PlacementPrediction";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Listen for storage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // Check on mount
    checkAuth();

    // Listen for storage events (works across tabs)
    window.addEventListener("storage", checkAuth);

    // Custom event for same-tab logout
    window.addEventListener("logout", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("logout", checkAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/students" 
          element={isLoggedIn ? <ManageStudents /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/performance" 
          element={isLoggedIn ? <PerformanceSummary /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/prediction" 
          element={isLoggedIn ? <PlacementPrediction /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn ? "/admin/dashboard" : "/login"} />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;