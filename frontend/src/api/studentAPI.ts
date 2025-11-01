// src/api/studentAPI.ts
const BASE_URL = "http://127.0.0.1:8000";

export type Student = {
  id?: number;
  name: string;
  email: string;
  cgpa?: number | null;
  iq?: number | null;
  prev_sem_result?: number | null;
  academic_performance?: number | null;
  communication_skills?: number | null;
  extra_curricular_score?: number | null;
  projects_completed?: number;
  internship_experience?: boolean;
};

export type StudentResponse = {
  student_id?: number;
  message?: string;
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${BASE_URL}/admin/students`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return await response.json();
}

export async function getStudentById(studentId: number): Promise<Student> {
  const response = await fetch(`${BASE_URL}/admin/students/${studentId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch student");
  }

  return await response.json();
}

export async function addStudent(student: Student): Promise<StudentResponse> {
  const response = await fetch(`${BASE_URL}/admin/students`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to add student" }));
    throw new Error(error.detail || "Failed to add student");
  }

  return await response.json();
}

export async function updateStudent(
  studentId: number,
  student: Partial<Student>
): Promise<StudentResponse> {
  const response = await fetch(`${BASE_URL}/admin/students/${studentId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to update student" }));
    throw new Error(error.detail || "Failed to update student");
  }

  return await response.json();
}

export async function deleteStudent(studentId: number): Promise<StudentResponse> {
  const response = await fetch(`${BASE_URL}/admin/students/${studentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to delete student" }));
    throw new Error(error.detail || "Failed to delete student");
  }

  return await response.json();
}

