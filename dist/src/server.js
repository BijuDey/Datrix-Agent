import chalk from "chalk";
import cors from "cors";
import express from "express";
import { executeRequest } from "./requestHandler.js";
export function createServer({ port = 4590, allowedOrigins = [] }) {
    const app = express();
    app.disable("x-powered-by");
    app.use(express.json({ limit: "1mb" }));
    app.use(cors({
        origin(origin, callback) {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin))
                return callback(null, true);
            return callback(new Error(`Origin not allowed: ${origin}`));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }));
    app.get("/health", (_req, res) => {
        res.json({ status: "running" });
    });
    app.post("/request", async (req, res) => {
        const result = await executeRequest(req.body || {});
        res.status(result.statusCode).json(result.body);
    });
    app.use((err, _req, res, _next) => {
        const message = err instanceof Error ? err.message : "Unhandled server error";
        res.status(500).json({ error: message });
    });
    const server = app.listen(port, () => {
        console.log(chalk.bold.green("Datrix Local Agent running"));
        console.log(chalk.cyan(`Port: ${port}`));
        console.log(chalk.yellow("Ready to receive requests"));
    });
    return { app, server };
}
//# sourceMappingURL=server.js.map