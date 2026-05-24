import { api } from "./api";

export const feedbackApi = {
  getAll: () => api.get("/api/Feedback"),
  submit: (data) => api.post("/api/Feedback", data, { auth: true }),
};