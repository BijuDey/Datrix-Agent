export declare const REQUEST_TIMEOUT_MS = 30000;
export declare const MAX_RESPONSE_BYTES: number;
export interface RequestPayload {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
}
export interface ExecuteRequestResult {
    statusCode: number;
    body: Record<string, unknown>;
}
export declare function executeRequest(payload: RequestPayload): Promise<ExecuteRequestResult>;
