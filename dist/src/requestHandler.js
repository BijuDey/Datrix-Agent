import axios from "axios";
import { normalizeMethod, validateTargetUrl } from "./security.js";
export const REQUEST_TIMEOUT_MS = 30_000;
export const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;
export async function executeRequest(payload) {
    const { url, method, headers, body } = payload || {};
    const methodCheck = normalizeMethod(method);
    if (!methodCheck.ok) {
        return { statusCode: 400, body: { error: methodCheck.reason } };
    }
    const urlCheck = validateTargetUrl(url || "");
    if (!urlCheck.ok) {
        return { statusCode: 400, body: { error: urlCheck.reason } };
    }
    try {
        const response = await axios({
            url: urlCheck.parsed.toString(),
            method: methodCheck.method,
            headers: headers || {},
            data: body,
            timeout: REQUEST_TIMEOUT_MS,
            maxContentLength: MAX_RESPONSE_BYTES,
            maxBodyLength: MAX_RESPONSE_BYTES,
            responseType: "stream",
            validateStatus: () => true,
        });
        const chunks = [];
        let totalBytes = 0;
        const streamResult = await new Promise((resolve, reject) => {
            response.data.on("data", (chunk) => {
                totalBytes += chunk.length;
                if (totalBytes > MAX_RESPONSE_BYTES) {
                    response.data.destroy();
                    reject(new Error("Response too large. Max size is 10MB."));
                    return;
                }
                chunks.push(chunk);
            });
            response.data.on("end", () => resolve(Buffer.concat(chunks)));
            response.data.on("error", reject);
        });
        const rawText = streamResult.toString("utf8");
        let parsedData = rawText;
        const contentType = String(response.headers["content-type"] || "").toLowerCase();
        if (contentType.includes("application/json")) {
            try {
                parsedData = JSON.parse(rawText);
            }
            catch {
                parsedData = rawText;
            }
        }
        return {
            statusCode: 200,
            body: {
                status: response.status,
                headers: response.headers,
                data: parsedData,
            },
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Request failed";
        const statusCode = message.toLowerCase().includes("timeout") ? 504 : 502;
        return {
            statusCode,
            body: {
                error: message,
            },
        };
    }
}
//# sourceMappingURL=requestHandler.js.map