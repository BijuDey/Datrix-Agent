export type UrlValidationResult = {
    ok: true;
    parsed: URL;
} | {
    ok: false;
    reason: string;
};
export type MethodNormalizationResult = {
    ok: true;
    method: string;
} | {
    ok: false;
    reason: string;
};
export declare function isIp(hostname: string): boolean;
export declare function validateTargetUrl(rawUrl: string): UrlValidationResult;
export declare function normalizeMethod(method: string | undefined): MethodNormalizationResult;
export declare function resolveAllowedOrigins(originsArg: string | undefined): string[];
