export interface ServerOptions {
    port?: number;
    allowedOrigins?: string[];
}
export declare function createServer({ port, allowedOrigins }: ServerOptions): {
    app: import("express-serve-static-core").Express;
    server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
};
