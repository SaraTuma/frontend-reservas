import privateApi from "./privateApi";

export class ReservationService {
  static async getAll() {
    const response = await privateApi.get("/api/reservations");
    return response.data.data;
  }

  static async create(data: any) {
    const response = await privateApi.post("/api/reservations", data);
    return response.data.data;
  }

  static async cancel(id: string) {
    const response = await privateApi.put(`/api/reservations/${id}/cancel`);
    return response.data.data;
  }

  static async updateStatus(id: string, status: string) {
    const response = await privateApi.put(`/api/reservations/${id}/status`, { status });
    return response.data.data;
  }
}
