// src/api/predictionAPI.ts
const BASE_URL = "http://127.0.0.1:8000";
const PREDICTION_URL = "https://mudfish-complete-luckily.ngrok-free.app/predict";

export type PredictionInput = {
  IQ: number;
  Prev_Sem_Result: number;
  CGPA: number;
  Academic_Performance: number;
  Extra_Curricular_Score: number;
  Communication_Skills: number;
  Projects_Completed: number;
  Internship_Experience_Yes: number; // 1 for Yes, 0 for No
};

export type StudentData = {
  id: number;
  name: string;
  email: string;
  iq: number;
  prev_sem_result: number;
  cgpa: number;
  academic_performance: number;
  communication_skills: number;
  extra_curricular_score: number;
  projects_completed: number;
  internship_experience: boolean;
};

export type PredictionResponse = {
  input_count: number;
  predictions: string[]; // Array of "Yes" or "No"
};

export async function predictPlacement(data: PredictionInput[]): Promise<PredictionResponse> {
  const response = await fetch(PREDICTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to predict placement" }));
    throw new Error(error.detail || "Failed to predict placement");
  }

  return await response.json();
}

export async function getStudentById(studentId: number): Promise<StudentData> {
  const response = await fetch(`${BASE_URL}/admin/students/${studentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to fetch student data" }));
    throw new Error(error.detail || "Failed to fetch student data");
  }

  return await response.json();
}

export async function predictPlacementByStudentId(studentId: number): Promise<{ prediction: string; studentData: StudentData }> {
  // First, get student data from database
  const studentData = await getStudentById(studentId);

  // Check if all required fields are present
  const requiredFields = ['iq', 'prev_sem_result', 'cgpa', 'academic_performance', 'communication_skills', 'extra_curricular_score', 'projects_completed', 'internship_experience'];
  const missingFields = requiredFields.filter(field => studentData[field as keyof StudentData] === null || studentData[field as keyof StudentData] === undefined);

  if (missingFields.length > 0) {
    throw new Error(`Student data incomplete. Missing fields: ${missingFields.join(', ')}`);
  }

  // Prepare prediction input
  const predictionInput: PredictionInput = {
    IQ: studentData.iq,
    Prev_Sem_Result: studentData.prev_sem_result,
    CGPA: studentData.cgpa,
    Academic_Performance: studentData.academic_performance,
    Extra_Curricular_Score: studentData.extra_curricular_score,
    Communication_Skills: studentData.communication_skills,
    Projects_Completed: studentData.projects_completed,
    Internship_Experience_Yes: studentData.internship_experience ? 1 : 0,
  };

  // Make prediction
  const predictionResponse = await predictPlacement([predictionInput]);
  const prediction = predictionResponse.predictions[0];

  return {
    prediction,
    studentData,
  };
}
