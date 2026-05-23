import { api } from "./api";

export const adminOrdersApi = {
  getAllOrders: () => api.get("/api/admin/orders", { auth: true }),
  updateOrderStatus: (id, status) =>
    api.put(`/api/admin/orders/${id}/status`, { status }, { auth: true }),
};