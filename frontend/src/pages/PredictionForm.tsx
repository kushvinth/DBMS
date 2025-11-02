// src/pages/PredictionForm.tsx
import React, { useState } from "react";
import { predictPlacement } from "../api/predictionAPI";
import { TrendingUp, Loader2, CheckCircle2, XCircle } from "lucide-react";

const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    IQ: "",
    Prev_Sem_Result: "",
    CGPA: "",
    Academic_Performance: "",
    Internship_Experience: "",
    Extra_Curricular_Score: "",
    Communication_Skills: "",
    Projects_Completed: "",
  });

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // Convert form data to API format
      const predictionData = [
        {
          IQ: parseFloat(formData.IQ),
          Prev_Sem_Result: parseFloat(formData.Prev_Sem_Result),
          CGPA: parseFloat(formData.CGPA),
          Academic_Performance: parseFloat(formData.Academic_Performance),
          Extra_Curricular_Score: parseFloat(formData.Extra_Curricular_Score),
          Communication_Skills: parseFloat(formData.Communication_Skills),
          Projects_Completed: parseInt(formData.Projects_Completed),
          Internship_Experience_Yes:
            formData.Internship_Experience === "Yes" ? 1 : 0,
        },
      ];

      const response = await predictPlacement(predictionData);
      const prediction = response.predictions[0];

      setResult(prediction === "Yes" ? "Yes" : "No");
    } catch (err: any) {
      setError(err.message || "Failed to predict placement. Please try again.");
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Placement Prediction Form
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  IQ *
                </label>
                <input
                  type="number"
                  name="IQ"
                  value={formData.IQ}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Previous Semester Result *
                </label>
                <input
                  type="number"
                  name="Prev_Sem_Result"
                  value={formData.Prev_Sem_Result}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                  max="10"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  CGPA *
                </label>
                <input
                  type="number"
                  name="CGPA"
                  value={formData.CGPA}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                  max="10"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Academic Performance *
                </label>
                <input
                  type="number"
                  name="Academic_Performance"
                  value={formData.Academic_Performance}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Extra Curricular Score *
                </label>
                <input
                  type="number"
                  name="Extra_Curricular_Score"
                  value={formData.Extra_Curricular_Score}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Communication Skills *
                </label>
                <input
                  type="number"
                  name="Communication_Skills"
                  value={formData.Communication_Skills}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Projects Completed *
                </label>
                <input
                  type="number"
                  name="Projects_Completed"
                  value={formData.Projects_Completed}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Internship Experience *
                </label>
                <select
                  name="Internship_Experience"
                  value={formData.Internship_Experience}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Predict Placement
                </>
              )}
            </button>
          </form>

          {result && (
            <div
              className={`mt-6 p-6 rounded-xl border-2 ${
                result === "Yes"
                  ? "bg-green-500/20 border-green-500 text-green-200"
                  : "bg-red-500/20 border-red-500 text-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {result === "Yes" ? (
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
                <div>
                  <h3 className="text-xl font-bold mb-1">Prediction Result</h3>
                  <p className="text-2xl font-bold">
                    {result === "Yes" ? "✅ Placed!" : "❌ Not Placed"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;