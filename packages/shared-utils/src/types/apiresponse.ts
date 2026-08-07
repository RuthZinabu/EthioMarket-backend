export interface ApiResponse {
  statuscode: number;
  message: string;
  data: Record<string, unknown>;
}
