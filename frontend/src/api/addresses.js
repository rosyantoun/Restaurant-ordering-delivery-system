import { api } from "./api";

export const addressApi = {
  getMine: () => api.get("/api/Addresses", { auth: true }),
  add: (data) => api.post("/api/Addresses", data, { auth: true }),
  update: (id, data) => api.put(`/api/Addresses/${id}`, data, { auth: true }),
  remove: (id) => api.del(`/api/Addresses/${id}`, { auth: true }),
};