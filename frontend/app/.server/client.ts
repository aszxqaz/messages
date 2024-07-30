import axios, { AxiosError, AxiosInstance } from "axios";
import { Message } from "./message";

if (!process.env.API_BASE_URL) {
  throw new Error("API_BASE_URL environment variable is not set");
}

const API_BASE_URL = process.env.API_BASE_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    console.log(`API client initialized with base URL: ${API_BASE_URL}`);
    this.client = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  async getMessages(): Promise<{ messages?: Message[]; error?: string }> {
    try {
      const res = await this.client.get("/messages");
      const messages = res.data["messages"].map(Message.fromJSON);
      return { messages };
    } catch (e) {
      return { error: JSON.stringify(e) };
    }
  }

  async postMessage(
    content: string,
    delay: number
  ): Promise<{ message?: Message; error?: string }> {
    try {
      const res = await this.client.post("/messages", {
        content,
        processing_delay: delay,
      });
      const message = Message.fromJSON(res.data["message"]);
      return { message };
    } catch (e) {
      return { error: this.mapAxiosError(e) };
    }
  }

  private mapAxiosError(e: any) {
    let error = "Unknown error occured";
    if (e instanceof AxiosError && e.response?.data?.error) {
      error = e.response.data.error;
    }
    return error;
  }
}

export const apiClient = new ApiClient();
