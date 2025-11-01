// src/api/adminAPI.ts
const BASE_URL = "http://127.0.0.1:8000";

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function loginAdmin(username: string, password: string): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return await response.json();
}

export interface DashboardResponse {
  message: string;
}

export async function getDashboard(token: string): Promise<DashboardResponse> {
  const response = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return await response.json();
}
