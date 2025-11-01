// src/api/performanceAPI.ts
const BASE_URL = "http://127.0.0.1:8000";

export type PerformanceSummary = {
  average_cgpa: number;
  average_iq: number;
  placement_rate: number;
};

export type TopPerformer = {
  id: number;
  name: string;
  CGPA?: number | null;
};

export type TopPerformersResponse = {
  top_performers: TopPerformer[];
};

export type SkillDistribution = {
  skill: string;
  count: number;
};

export type SkillDistributionResponse = {
  skill_distribution: SkillDistribution[];
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getPerformanceSummary(): Promise<PerformanceSummary> {
  const response = await fetch(`${BASE_URL}/admin/performance/summary`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch performance summary");
  }

  return await response.json();
}

export async function getTopPerformers(): Promise<TopPerformersResponse> {
  const response = await fetch(`${BASE_URL}/admin/performance/top-performers`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch top performers");
  }

  return await response.json();
}

export async function getSkillDistribution(): Promise<SkillDistributionResponse> {
  const response = await fetch(`${BASE_URL}/admin/performance/skill-distribution`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch skill distribution");
  }

  return await response.json();
}

