#!/usr/bin/env node
import { Command } from "commander";
import { createServer } from "../src/server.js";
import { resolveAllowedOrigins } from "../src/security.js";
const program = new Command();
program
    .name("datrix-agent")
    .description("Local API Agent for Datrix API Studio")
    .option("-p, --port <port>", "Port to run on", "4590")
    .option("-o, --origins <origins>", "Comma-separated list of allowed origins", "http://localhost:3000,https://yourwebapp.com")
    .action((options) => {
    const parsedPort = Number(options.port);
    const port = Number.isFinite(parsedPort) ? parsedPort : 4590;
    const allowedOrigins = resolveAllowedOrigins(options.origins);
    createServer({ port, allowedOrigins });
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map