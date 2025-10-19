import privateApi from "./privateApi";

export class TransactionsService {
  static async getAll() {
    const response = await privateApi.get("/api/transactions");
    return response.data.data;
  }

  static async getByUser(userId: number) {
    const response = await privateApi.get(`/api/transactions?userId=${userId}`);
    return response.data.data;
  }
}
