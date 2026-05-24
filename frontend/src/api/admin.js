import { api } from "./api";

export const adminApi = {
  getMenu: () => api.get("/api/Admin/menu", { auth: true }),
  createMenuItem: (data) => api.post("/api/Admin/menu", data, { auth: true }),
  updateMenuItem: (id, data) => api.put(`/api/Admin/menu/${id}`, data, { auth: true }),
  deleteMenuItem: (id) => api.del(`/api/Admin/menu/${id}`, { auth: true }),
  getAllOrders: () => api.get("/api/Admin/orders", { auth: true }),
  updateOrderStatus: (id, status) =>
    api.put(`/api/Admin/orders/${id}/status`, { status }, { auth: true }),

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
