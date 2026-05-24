import { api } from "./api";

export const cartApi = {
  getCart: () => api.get("/api/Cart", { auth: true }),
  getCount: () => api.get("/api/Cart/count", { auth: true }),
  add: (menuItemId, quantity) =>
    api.post("/api/Cart", { menuItemId, quantity }, { auth: true }),
  update: (cartItemId, quantity) =>
    api.put(`/api/Cart/${cartItemId}`, { quantity }, { auth: true }),
  remove: (cartItemId) => api.del(`/api/Cart/${cartItemId}`, { auth: true }),
  clear: () => api.del("/api/Cart", { auth: true }),
};