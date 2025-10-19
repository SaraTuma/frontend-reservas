import privateApi from "./privateApi";

export class StatsService {
  static async getCounts() {
    const response = await privateApi.get("/api/stats");
    return response.data;
  }
}
