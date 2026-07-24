export interface AuditRequest {
  url: string;
}

export interface AuditResult {
  url: string;
  status: number;
  responseTimeMs: number;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  missingAltImages: number;
  wordCount: number;
  isBotProtected?: boolean;
}

export interface AuditError {
  error: string;
  statusCode: number;
}
