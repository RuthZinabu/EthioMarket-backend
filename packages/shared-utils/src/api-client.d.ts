export declare class ApiClient {
    private baseURL;
    private timeout;
    constructor(baseURL: string);
    get<T>(endpoint: string, headers?: any): Promise<T>;
    post<T>(endpoint: string, data: any, headers?: any): Promise<T>;
    put<T>(endpoint: string, data: any, headers?: any): Promise<T>;
    delete<T>(endpoint: string, headers?: any): Promise<T>;
}
//# sourceMappingURL=api-client.d.ts.map