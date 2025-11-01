// src/pages/PerformanceSummary.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PerformanceSummary as PerformanceSummaryType, TopPerformer, SkillDistribution } from "../api/performanceAPI";
import {
  getPerformanceSummary,
  getTopPerformers,
  getSkillDistribution,
} from "../api/performanceAPI";
import Sidebar from "../components/Sidebar";
import { 
  RefreshCw, 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  Trophy, 
  BarChart3, 
  TrendingUp,
  Target,
  Medal
} from "lucide-react";

const PerformanceSummary: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [summary, setSummary] = useState<PerformanceSummaryType | null>(null);
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

  // Helper function to create a progress bar
  const ProgressBar = ({ value, max, color, label }: { value: number; max: number; color: string; label: string }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          <span className={`font-semibold ${color}`}>{value.toFixed(1)}</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  // Helper function to get medal icon
  const getMedal = (rank: number) => {
    if (rank === 1) return <Medal className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

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
          <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Performance Summary
              </h1>
              <p className="text-gray-400 mt-1">Comprehensive analytics and insights</p>
            </div>
            <button
              onClick={fetchPerformanceData}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6 shadow-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-400">Loading performance data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Average CGPA Card */}
                  <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden group">
                    <div 
                      className="absolute inset-0 opacity-20 bg-repeat"
                      style={{
                        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                      }}
                    ></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-500/30 p-4 rounded-xl backdrop-blur-sm">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <p className="text-blue-100 text-sm font-medium mb-2">Average CGPA</p>
                      <p className="text-4xl font-bold mb-2">{summary.average_cgpa.toFixed(2)}</p>
                      <ProgressBar 
                        value={summary.average_cgpa} 
                        max={10} 
                        color="from-blue-400 to-blue-600" 
                        label="Out of 10"
                      />
                    </div>
                  </div>

                  {/* Average IQ Card */}
                  <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden group">
                    <div 
                      className="absolute inset-0 opacity-20 bg-repeat"
                      style={{
                        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                      }}
                    ></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-500/30 p-4 rounded-xl backdrop-blur-sm">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <p className="text-purple-100 text-sm font-medium mb-2">Average IQ</p>
                      <p className="text-4xl font-bold mb-2">{summary.average_iq.toFixed(0)}</p>
                      <ProgressBar 
                        value={summary.average_iq} 
                        max={200} 
                        color="from-purple-400 to-purple-600" 
                        label="IQ Score"
                      />
                    </div>
                  </div>

                  {/* Placement Rate Card */}
                  <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden group">
                    <div 
                      className="absolute inset-0 opacity-20 bg-repeat"
                      style={{
                        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                      }}
                    ></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-500/30 p-4 rounded-xl backdrop-blur-sm">
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <p className="text-green-100 text-sm font-medium mb-2">Placement Rate</p>
                      <p className="text-4xl font-bold mb-2">{summary.placement_rate.toFixed(1)}%</p>
                      <ProgressBar 
                        value={summary.placement_rate} 
                        max={100} 
                        color="from-green-400 to-green-600" 
                        label="Success Rate"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Top Performers */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Top 5 Performers
                  </h2>
                  <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold">
                    Leaderboard
                  </span>
                </div>
                {topPerformers.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No top performers found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topPerformers.map((student, index) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50"
                            : index === 1
                            ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/50"
                            : index === 2
                            ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/50"
                            : "bg-gray-700/30 border border-gray-600/50"
                        } hover:bg-gray-700/50`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center">
                            {getMedal(index + 1)}
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-semibold text-white">{student.name}</p>
                            <p className="text-sm text-gray-400">Student ID: #{student.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">
                            {student.CGPA?.toFixed(2) || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">CGPA</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skill Distribution */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  Skill Distribution
                </h2>
                {skillDistribution.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No skill distribution data available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillDistribution.map((skill, index) => {
                      const colors = [
                        "from-blue-500 to-blue-600",
                        "from-purple-500 to-purple-600",
                        "from-green-500 to-green-600",
                        "from-orange-500 to-orange-600",
                        "from-pink-500 to-pink-600",
                        "from-cyan-500 to-cyan-600",
                      ];
                      const color = colors[index % colors.length];
                      
                      return (
                        <div
                          key={index}
                          className={`bg-gradient-to-br ${color} rounded-xl p-5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-white">{skill.skill || "Unknown"}</span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-2xl font-bold text-white">
                              {skill.count}
                            </span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full transition-all duration-1000"
                              style={{
                                width: `${Math.min((skill.count / Math.max(...skillDistribution.map(s => s.count))) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Additional Stats */}
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                      Performance Insights
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">Average CGPA</span>
                        <span className="text-xl font-bold text-blue-400">{summary.average_cgpa.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">Average IQ</span>
                        <span className="text-xl font-bold text-purple-400">{summary.average_iq.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">Placement Rate</span>
                        <span className="text-xl font-bold text-green-400">{summary.placement_rate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-400" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate("/admin/students")}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        View All Students
                      </button>
                      <button
                        onClick={fetchPerformanceData}
                        className="w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white p-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Refresh Data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;