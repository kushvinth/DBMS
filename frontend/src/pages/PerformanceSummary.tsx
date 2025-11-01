// src/pages/PerformanceSummary.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PerformanceSummary, TopPerformer, SkillDistribution } from "../api/performanceAPI";
import {
  getPerformanceSummary,
  getTopPerformers,
  getSkillDistribution,
} from "../api/performanceAPI";

const PerformanceSummary: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [skillDistribution, setSkillDistribution] = useState<SkillDistribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError("");
      const [summaryData, topPerformersData, skillData] = await Promise.all([
        getPerformanceSummary(),
        getTopPerformers(),
        getSkillDistribution(),
      ]);
      setSummary(summaryData);
      setTopPerformers(topPerformersData.top_performers || []);
      setSkillDistribution(skillData.skill_distribution || []);
    } catch (err) {
      setError("Failed to load performance data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
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

          <button
            onClick={() => navigate("/admin/performance")}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white transition-colors"
          >
            <span className="text-xl">📈</span>
            {sidebarOpen && <span>Performance Summary</span>}
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
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Performance Summary</h1>
            <button
              onClick={fetchPerformanceData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-gray-400">Loading performance data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-200 text-sm font-medium">Average CGPA</p>
                        <p className="text-3xl font-bold mt-2">{summary.average_cgpa}</p>
                      </div>
                      <div className="text-4xl opacity-50">📚</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm font-medium">Average IQ</p>
                        <p className="text-3xl font-bold mt-2">{summary.average_iq}</p>
                      </div>
                      <div className="text-4xl opacity-50">🧠</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-200 text-sm font-medium">Placement Rate</p>
                        <p className="text-3xl font-bold mt-2">{summary.placement_rate}%</p>
                      </div>
                      <div className="text-4xl opacity-50">✅</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Performers */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Top 5 Performers</h2>
                {topPerformers.length === 0 ? (
                  <p className="text-gray-400">No top performers found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            CGPA
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {topPerformers.map((student, index) => (
                          <tr key={student.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              #{index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                              {student.CGPA?.toFixed(2) || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Skill Distribution */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Skill Distribution</h2>
                {skillDistribution.length === 0 ? (
                  <p className="text-gray-400">No skill distribution data available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillDistribution.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{skill.skill || "Unknown"}</span>
                          <span className="text-blue-400 font-bold">{skill.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;

