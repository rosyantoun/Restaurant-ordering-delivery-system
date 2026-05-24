import { api } from "./api";

export const menuApi = {
  getItems: ({ categoryId, search } = {}) => {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (search) params.append("search", search);
    const qs = params.toString();
    return api.get(`/api/menu/items${qs ? `?${qs}` : ""}`);
  },
  getCategories: () => api.get("/api/menu/categories"),
};