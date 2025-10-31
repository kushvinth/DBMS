// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { getDashboard } from "../api/adminAPI";

const AdminDashboard: React.FC = () => {
  const [message, setMessage] = useState<string>("Loading...");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl mb-4">Admin Dashboard</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
