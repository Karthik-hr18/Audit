import axios from "axios";
import https from "https";
import { validateAndNormalizeUrl } from "../utils/urlValidator";
import { parseHtml } from "./parserService";
import { AuditResult, AuditError } from "../types/audit";

const TIMEOUT_MS = 8000;

// HTTPS Agent that accepts self-signed or legacy SSL certificates for auditing flexibility
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function executeAudit(rawUrl: string): Promise<AuditResult> {
  const startTime = performance.now();

  try {
    // 1. Validate & Normalize URL syntax (Inside try block so validation errors return 400)
    const targetUrl = validateAndNormalizeUrl(rawUrl);

    // 2. Fetch page with HTTP client using Chrome user agent
    const response = await axios.get(targetUrl, {
      timeout: TIMEOUT_MS,
      httpsAgent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      maxRedirects: 5,
      validateStatus: () => true, // Inspect HTTP status even for 404 / 500
      responseType: "text",
    });

    const endTime = performance.now();
    const responseTimeMs = Math.round(endTime - startTime);

    // 3. Check Content-Type header for non-HTML responses
    const contentType = (response.headers["content-type"] || "").toString().toLowerCase();
    if (contentType && !contentType.includes("text/html") && !contentType.includes("xhtml")) {
      const err: AuditError = {
        error: `Target URL returned non-HTML content type (${contentType.split(";")[0]}). Page Pulse can only audit HTML web pages.`,
        statusCode: 422,
      };
      throw err;
    }

    // 4. Parse HTML content
    const parsedData = parseHtml(typeof response.data === "string" ? response.data : "");

    return {
      url: targetUrl,
      status: response.status,
      responseTimeMs,
      ...parsedData,
    };
  } catch (error: any) {
    // If it's already an AuditError structure (like non-HTML content type), rethrow
    if (error && typeof error.statusCode === "number" && typeof error.error === "string") {
      throw error;
    }

    // Translate Axios/Node network failures into sensible human-readable errors
    let errorMessage = "Failed to audit the provided URL.";
    let statusCode = 400; // Default to 400 for input/validation errors

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        errorMessage = `Request timed out after ${TIMEOUT_MS / 1000} seconds. The target server did not respond in time.`;
        statusCode = 504;
      } else if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") {
        errorMessage = "Domain name could not be resolved. Please verify the URL and try again.";
        statusCode = 400;
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "Connection refused by the target server.";
        statusCode = 502;
      } else if (error.code === "ERR_INVALID_URL") {
        errorMessage = "Invalid URL structure.";
        statusCode = 400;
      } else {
        errorMessage = `Network Error: ${error.message}`;
        statusCode = 502;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      statusCode = 400;
    }

    const auditErr: AuditError = {
      error: errorMessage,
      statusCode,
    };

    throw auditErr;
  }
}
