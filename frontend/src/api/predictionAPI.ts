// src/api/predictionAPI.ts
const BASE_URL = "http://127.0.0.1:8000";

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

export type PredictionResponse = {
  input_count: number;
  predictions: string[]; // Array of "Yes" or "No"
};

export async function predictPlacement(data: PredictionInput[]): Promise<PredictionResponse> {
  const response = await fetch(`${BASE_URL}/predict`, {
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
