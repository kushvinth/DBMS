// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api/adminAPI";

const AdminDashboard: React.FC = () => {
  const [message, setMessage] = useState<string>("Loading...");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        if (token) {
          const data = await getDashboard(token);
          setMessage(data.message);
        } else {
          setMessage("Unauthorized. Please log in again.");
        }
      } catch {
        setMessage("Unauthorized. Please log in again.");
      }
    }
    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Dispatch custom event to trigger App re-render
    window.dispatchEvent(new Event("logout"));
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white transition-colors"
          >
            <span className="text-xl">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => navigate("/admin/students")}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
          >
            <span className="text-xl">👥</span>
            {sidebarOpen && <span>Manage Students</span>}
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl mb-4">Admin Dashboard</h1>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;