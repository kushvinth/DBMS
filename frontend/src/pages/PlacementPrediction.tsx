// src/pages/PlacementPrediction.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { 
  Brain, 
  Search, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  User,
  Mail,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  MessageSquare,
  Trophy,
  Code,
  Lightbulb
} from "lucide-react";

interface PredictionResult {
  student_id: number;
  student_name: string;
  student_email: string;
  prediction: string;
  student_data: {
    IQ: number;
    Prev_Sem_Result: number;
    CGPA: number;
    Academic_Performance: number;
    Extra_Curricular_Score: number;
    Communication_Skills: number;
    Projects_Completed: number;
    Internship_Experience_Yes: number;
  };
}

const PlacementPrediction: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [studentId, setStudentId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
    navigate("/login");
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/predict/student/${studentId}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error + (data.message ? `: ${data.message}` : ""));
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError("Failed to connect to prediction service. Please try again.");
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (key: string) => {
    const iconMap: { [key: string]: any } = {
      IQ: Lightbulb,
      Prev_Sem_Result: BookOpen,
      CGPA: Award,
      Academic_Performance: TrendingUp,
      Extra_Curricular_Score: Trophy,
      Communication_Skills: MessageSquare,
      Projects_Completed: Code,
      Internship_Experience_Yes: Briefcase,
    };
    return iconMap[key] || TrendingUp;
  };

  const getMetricLabel = (key: string) => {
    const labelMap: { [key: string]: string } = {
      IQ: "IQ Score",
      Prev_Sem_Result: "Previous Semester",
      CGPA: "CGPA",
      Academic_Performance: "Academic Performance",
      Extra_Curricular_Score: "Extra Curricular",
      Communication_Skills: "Communication Skills",
      Projects_Completed: "Projects Completed",
      Internship_Experience_Yes: "Internship Experience",
    };
    return labelMap[key] || key;
  };

  const getMetricValue = (key: string, value: number) => {
    if (key === "Internship_Experience_Yes") {
      return value === 1 ? "Yes" : "No";
    }
    return value;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Placement Prediction
                </h1>
                <p className="text-gray-400 mt-1">AI-powered placement prediction system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl sticky top-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-400" />
                  Enter Student ID
                </h2>
                
                <form onSubmit={handlePredict} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Student ID
                    </label>
                    <input
                      type="number"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter student ID..."
                      required
                      min="1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        Predict Placement
                      </>
                    )}
                  </button>
                </form>

                {error && (
                  <div className="mt-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl flex items-start gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">{error}</div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <p className="text-sm text-blue-200">
                    <strong>Tip:</strong> Enter a valid student ID to get AI-powered placement prediction based on their academic and personal data.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              {result ? (
                <div className="space-y-6">
                  {/* Student Info Card */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                    <h2 className="text-xl font-bold mb-4">Student Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <User className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">Name</p>
                          <p className="font-semibold">{result.student_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="font-semibold text-sm">{result.student_email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prediction Result Card */}
                  <div
                    className={`rounded-2xl p-8 border-2 shadow-2xl ${
                      result.prediction === "Yes"
                        ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500"
                        : "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {result.prediction === "Yes" ? (
                        <div className="p-4 bg-green-500/20 rounded-2xl">
                          <CheckCircle2 className="w-12 h-12 text-green-400" />
                        </div>
                      ) : (
                        <div className="p-4 bg-red-500/20 rounded-2xl">
                          <XCircle className="w-12 h-12 text-red-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold mb-1">Prediction Result</h3>
                        <p className="text-3xl font-bold">
                          {result.prediction === "Yes" ? (
                            <span className="text-green-400">✅ Likely to be Placed!</span>
                          ) : (
                            <span className="text-red-400">❌ May Need Improvement</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-4">
                      {result.prediction === "Yes"
                        ? "Based on the student's academic performance and skills, they have a high probability of securing placement."
                        : "The student may need to improve their academic performance, skills, or experience to increase placement chances."}
                    </p>
                  </div>

                  {/* Student Metrics */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                    <h2 className="text-xl font-bold mb-4">Student Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.student_data).map(([key, value]) => {
                        const Icon = getMetricIcon(key);
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all"
                          >
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <Icon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-400">{getMetricLabel(key)}</p>
                              <p className="font-bold text-lg">{getMetricValue(key, value)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 shadow-xl flex flex-col items-center justify-center min-h-[500px]">
                  <div className="p-6 bg-purple-500/10 rounded-full mb-6">
                    <Brain className="w-16 h-16 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-300">No Prediction Yet</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    Enter a student ID and click "Predict Placement" to see AI-powered prediction results based on their academic data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementPrediction;
