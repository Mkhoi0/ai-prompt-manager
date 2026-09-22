// api.js — small wrapper around fetch for talking to the backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export const api = {
  register: (email, password) =>
    request("/api/auth/register", { method: "POST", body: { email, password }, auth: false }),
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password }, auth: false }),
  getPrompts: (params = "") => request(`/api/prompts${params}`),
  getPrompt: (id) => request(`/api/prompts/${id}`),
  createPrompt: (data) => request("/api/prompts", { method: "POST", body: data }),
  updatePrompt: (id, data) => request(`/api/prompts/${id}`, { method: "PUT", body: data }),
  deletePrompt: (id) => request(`/api/prompts/${id}`, { method: "DELETE" }),
};
