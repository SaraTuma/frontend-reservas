import privateApi from "./privateApi";

export class UserService {
  static async getAll() {
    const response = await privateApi.get("/api/users");
    return response.data.data;
  }

  static async getById(id: string) {
    const response = await privateApi.get(`/api/users/${id}`);
    return response.data;
  }

  static async getClientsByProvider(providerId: string) {
    const response = await privateApi.get(`/api/users/${providerId}`);
    return response.data;
  }

  static async update(id: string, data: any) {
    const response = await privateApi.put(`/api/users/${id}`, data);
    return response.data;
  }

  static async delete(id: string) {
    const response = await privateApi.delete(`/api/users/${id}`);
    return response.data;
  }
}
