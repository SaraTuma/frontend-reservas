import privateApi from "./privateApi";

export class ServiceService {
  static async getAll() {
    const response = await privateApi.get("/api/services");
    return response.data.data;
  }

  static async getById(id: number) {
    const response = await privateApi.get(`/api/services/${id}`);
    return response.data;
  }

  static async create(data: any) {
    const response = await privateApi.post("/api/services", data);
    return response.data;
  }

  static async update(id: number, data: any) {
    const response = await privateApi.put(`/api/services/${id}`, data);
    return response.data;
  }

  static async delete(id: number) {
    const response = await privateApi.delete(`/api/services/${id}`);
    return response.data;
  }
}
