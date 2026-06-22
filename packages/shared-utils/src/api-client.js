"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiClient {
    constructor(baseURL) {
        this.timeout = 10000;
        this.baseURL = baseURL;
    }
    async get(endpoint, headers) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}${endpoint}`, {
                timeout: this.timeout,
                headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`GET request failed: ${error}`);
        }
    }
    async post(endpoint, data, headers) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}${endpoint}`, data, {
                timeout: this.timeout,
                headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`POST request failed: ${error}`);
        }
    }
    async put(endpoint, data, headers) {
        try {
            const response = await axios_1.default.put(`${this.baseURL}${endpoint}`, data, {
                timeout: this.timeout,
                headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`PUT request failed: ${error}`);
        }
    }
    async delete(endpoint, headers) {
        try {
            const response = await axios_1.default.delete(`${this.baseURL}${endpoint}`, {
                timeout: this.timeout,
                headers,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`DELETE request failed: ${error}`);
        }
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=api-client.js.map