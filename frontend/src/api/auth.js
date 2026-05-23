import { api } from "./api";

export const authApi = {
  register: (data) => api.post("/api/Auth/register", data),
  login: (data) => api.post("/api/Auth/login", data),
};