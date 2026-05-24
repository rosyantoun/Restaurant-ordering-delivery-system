<<<<<<< HEAD
import { api } from "./api";

export const adminMenuApi = {
  getMenu: () => api.get("/api/admin/menu", { auth: true }),
  createMenuItem: (data) => api.post("/api/admin/menu", data, { auth: true }),
  updateMenuItem: (id, data) => api.put(`/api/admin/menu/${id}`, data, { auth: true }),
  deleteMenuItem: (id) => api.del(`/api/admin/menu/${id}`, { auth: true }),

  uploadImage: async (file) => {
    const form = new FormData();
    form.append("file", file);
    const token = localStorage.getItem("tastybites_token");
    const res = await fetch(`${api.API_URL}/api/Upload/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    return data.url;
  },
};
=======
// API service for Admin Menu — to be implemented by Serena
export {};
>>>>>>> origin/main
