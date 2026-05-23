import { api } from "./api";

export const orderApi = {
  checkout: (data) => api.post("/api/Orders/checkout", data, { auth: true }),
  getMine: () => api.get("/api/Orders", { auth: true }),
  getById: (id) => api.get(`/api/Orders/${id}`, { auth: true }),
  reorder: (id) => api.post(`/api/Orders/${id}/reorder`, {}, { auth: true }),
};