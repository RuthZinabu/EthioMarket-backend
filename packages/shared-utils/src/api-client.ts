import axios from 'axios';

export class ApiClient {
  private baseURL: string;
  private timeout: number = 10000;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, headers?: any): Promise<T> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        timeout: this.timeout,
        headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`GET request failed: ${error}`);
    }
  }

  async post<T>(endpoint: string, data: any, headers?: any): Promise<T> {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        timeout: this.timeout,
        headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`POST request failed: ${error}`);
    }
  }

  async put<T>(endpoint: string, data: any, headers?: any): Promise<T> {
    try {
      const response = await axios.put(`${this.baseURL}${endpoint}`, data, {
        timeout: this.timeout,
        headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`PUT request failed: ${error}`);
    }
  }

  async delete<T>(endpoint: string, headers?: any): Promise<T> {
    try {
      const response = await axios.delete(`${this.baseURL}${endpoint}`, {
        timeout: this.timeout,
        headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`DELETE request failed: ${error}`);
    }
  }
}
