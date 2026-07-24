/**
 * Validates and normalizes a given URL string.
 * @param rawUrl The URL input from user request
 * @returns Normalized URL string or throws an Error if invalid
 */
export function validateAndNormalizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    throw new Error("URL parameter is required and must be a string.");
  }

  let trimmed = rawUrl.trim();
  
  // If no protocol specified, default to https://
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Only HTTP and HTTPS protocols are supported.");
    }

    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      throw new Error("Invalid domain name format.");
    }

    return parsed.href;
  } catch (err: any) {
    if (err.message && err.message.includes("Only HTTP")) {
      throw err;
    }
    if (err.message && err.message.includes("Invalid domain")) {
      throw err;
    }
    throw new Error("Invalid URL format. Please enter a valid web address (e.g., https://example.com).");
  }
}
