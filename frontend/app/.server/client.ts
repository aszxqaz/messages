import axios, { AxiosInstance } from "axios";

const BASE_API_URL = "https://messages-aszxqaz.up.railway.app/api/v1";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_API_URL,
    });
  }

  async getMessages(): Promise<Message[]> {
    const res = await this.client.get("/messages");
    const messages = res.data.map(Message.fromJSON);
    return messages;
  }
}

export const apiClient = new ApiClient();
