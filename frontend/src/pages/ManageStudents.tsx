// src/pages/ManageStudents.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Student } from "../api/studentAPI";
import { getStudents, addStudent, updateStudent, deleteStudent } from "../api/studentAPI";
import Sidebar from "../components/Sidebar";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  ArrowUp, 
  ArrowDown, 
  ChevronsUpDown,
  BookOpen,
  CheckCircle2
} from "lucide-react";

const ManageStudents: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    email: "",
    cgpa: undefined,
    iq: undefined,
    prev_sem_result: undefined,
    academic_performance: undefined,
    communication_skills: undefined,
    extra_curricular_score: undefined,
    projects_completed: 0,
    internship_experience: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchQuery, sortBy, sortOrder]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = [...students];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = (a as any)[sortBy];
      const bVal = (b as any)[sortBy];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
    navigate("/login");
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      cgpa: undefined,
      iq: undefined,
      prev_sem_result: undefined,
      academic_performance: undefined,
      communication_skills: undefined,
      extra_curricular_score: undefined,
      projects_completed: 0,
      internship_experience: false,
    });
    setShowForm(true);
    setError("");
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      cgpa: student.cgpa ?? undefined,
      iq: student.iq ?? undefined,
      prev_sem_result: student.prev_sem_result ?? undefined,
      academic_performance: student.academic_performance ?? undefined,
      communication_skills: student.communication_skills ?? undefined,
      extra_curricular_score: student.extra_curricular_score ?? undefined,
      projects_completed: student.projects_completed ?? 0,
      internship_experience: student.internship_experience ?? false,
    });
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (studentId: number) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await deleteStudent(studentId);
      await fetchStudents();
    } catch (err) {
      alert("Failed to delete student. Please try again.");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingStudent && editingStudent.id) {
        await updateStudent(editingStudent.id, formData);
      } else {
        await addStudent(formData as Student);
      }
      setShowForm(false);
      await fetchStudents();
    } catch (err: any) {
      setError(err.message || "Failed to save student. Please try again.");
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
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
                Manage Students
              </h1>
              <p className="text-gray-400 mt-1">Total Students: {students.length}</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Student
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="id">Sort by ID</option>
                  <option value="name">Sort by Name</option>
                  <option value="cgpa">Sort by CGPA</option>
                  <option value="iq">Sort by IQ</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 transition-all flex items-center gap-2"
                >
                  {sortOrder === "asc" ? (
                    <>
                      <ArrowUp className="w-4 h-4" />
                      Asc
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4" />
                      Desc
                    </>
                  )}
                </button>
              </div>
            </div>
            {filteredStudents.length !== students.length && (
              <div className="mt-3 text-sm text-gray-400">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            )}
          </div>

          {error && !showForm && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-4 shadow-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-400">Loading students...</p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700/50 shadow-xl">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-xl mb-2">
                {searchQuery ? "No students found matching your search." : "No students found."}
              </p>
              <p className="text-gray-500 text-sm">
                {searchQuery ? "Try adjusting your search criteria." : "Add your first student to get started!"}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                      <tr>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition-colors"
                          onClick={() => handleSort("id")}
                        >
                          <div className="flex items-center gap-2">
                            ID <SortIcon field="id" />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition-colors"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center gap-2">
                            Name <SortIcon field="name" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition-colors"
                          onClick={() => handleSort("cgpa")}
                        >
                          <div className="flex items-center gap-2">
                            CGPA <SortIcon field="cgpa" />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition-colors"
                          onClick={() => handleSort("iq")}
                        >
                          <div className="flex items-center gap-2">
                            IQ <SortIcon field="iq" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Projects
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Internship
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                      {currentStudents.map((student) => (
                        <tr 
                          key={student.id} 
                          className="hover:bg-gray-700/30 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                            #{student.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.cgpa !== null && student.cgpa !== undefined ? (
                              <span className={`font-semibold ${
                                student.cgpa >= 8 ? "text-green-400" :
                                student.cgpa >= 7 ? "text-yellow-400" :
                                "text-red-400"
                              }`}>
                                {student.cgpa.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {student.iq !== null && student.iq !== undefined ? student.iq : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs font-semibold">
                              {student.projects_completed ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.internship_experience ? (
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Yes
                              </span>
                            ) : (
                              <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-lg text-xs font-semibold">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(student)}
                                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-1.5"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => student.id && handleDelete(student.id)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-xl">
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-gray-700/50 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {editingStudent ? "Edit Student" : "Add New Student"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition-all hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">CGPA</label>
                  <input
                    type="number"
                    name="cgpa"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa ?? ""}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">IQ</label>
                  <input
                    type="number"
                    name="iq"
                    step="0.01"
                    value={formData.iq ?? ""}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Previous Semester Result</label>
                  <input
                    type="number"
                    name="prev_sem_result"
                    step="0.01"
                    value={formData.prev_sem_result ?? ""}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Academic Performance</label>
                  <input
                    type="number"
                    name="academic_performance"
                    step="0.01"
                    value={formData.academic_performance ?? ""}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Communication Skills</label>
                  <input
                    type="number"
                    name="communication_skills"
                    step="0.01"
                    value={formData.communication_skills ?? ""}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Extra Curricular Score</label>
                  <input
                    type="number"
                    name="extra_curricular_score"
                    step="0.01"
                    value={formData.extra_curricular_score ?? ""}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Projects Completed</label>
                  <input
                    type="number"
                    name="projects_completed"
                    min="0"
                    value={formData.projects_completed ?? 0}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="internship_experience"
                      checked={formData.internship_experience || false}
                      onChange={handleChange}
                      className="w-6 h-6 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-blue-600 cursor-pointer transition-all"
                    />
                    <span className="ml-3 text-gray-300 font-semibold group-hover:text-white transition-colors">
                      Internship Experience
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {editingStudent ? "Update Student" : "Add Student"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-300 font-semibold border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;