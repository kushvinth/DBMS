// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api/adminAPI";
import { getStudents } from "../api/studentAPI";
import { getPerformanceSummary } from "../api/performanceAPI";
import Sidebar from "../components/Sidebar";
import { Users, BookOpen, CheckCircle2, Brain, GraduationCap, Zap, Server, Activity, TrendingUp } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [message, setMessage] = useState<string>("Loading...");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (token) {
        const [dashboardData, studentsData, perfData] = await Promise.all([
          getDashboard(token).catch(() => ({ message: "Welcome back!" })),
          getStudents().catch(() => []),
          getPerformanceSummary().catch(() => null),
        ]);
        setMessage(dashboardData.message);
        setTotalStudents(studentsData.length);
        setPerformance(perfData);
      } else {
        setMessage("Unauthorized. Please log in again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
    navigate("/login");
  };

  const statsCards = [
    {
      title: "Total Students",
      value: totalStudents,
      Icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      title: "Average CGPA",
      value: performance?.average_cgpa?.toFixed(2) || "N/A",
      Icon: BookOpen,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
    {
      title: "Placement Rate",
      value: performance?.placement_rate 
        ? `${performance.placement_rate.toFixed(1)}%` 
        : "N/A",
      Icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
    },
    {
      title: "Average IQ",
      value: performance?.average_iq?.toFixed(0) || "N/A",
      Icon: Brain,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-400 mt-1">{message}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Last updated</p>
                <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-400">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <div
                    key={index}
                    className={`relative bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden group`}
                  >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div 
                        className="absolute inset-0 bg-repeat"
                        style={{
                          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                        }}
                      ></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${stat.bgColor} p-3 rounded-xl`}>
                          <stat.Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                      <p className="text-white/90 font-medium text-sm">{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate("/admin/students")}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex flex-col items-center"
                    >
                      <Users className="w-6 h-6 mb-2" />
                      <div>Manage Students</div>
                    </button>
                    <button
                      onClick={() => navigate("/admin/performance")}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex flex-col items-center"
                    >
                      <TrendingUp className="w-6 h-6 mb-2" />
                      <div>View Performance</div>
                    </button>
                    <button
                      onClick={() => navigate("/admin/prediction")}
                      className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white p-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex flex-col items-center col-span-2"
                    >
                      <Brain className="w-6 h-6 mb-2" />
                      <div>AI Prediction</div>
                    </button>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    System Status
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">Database Connection</span>
                      <span className="text-green-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">API Status</span>
                      <span className="text-green-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">Active Sessions</span>
                      <span className="text-blue-400 font-semibold flex items-center gap-1">
                        <Server className="w-4 h-4" /> 1
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <GraduationCap className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h2>
                    <p className="text-gray-300">
                      Manage student records, track performance metrics, and analyze placement statistics all in one place.
                      Use the navigation menu to access different sections of the system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;