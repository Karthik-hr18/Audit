import { Request, Response, NextFunction } from "express";
import { executeAudit } from "../services/auditService";

export async function handleAuditRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string" || url.trim() === "") {
      res.status(400).json({
        error: "Missing required 'url' string parameter in request body.",
      });
      return;
    }

    const auditResult = await executeAudit(url);
    res.status(200).json(auditResult);
  } catch (error: any) {
    if (error && typeof error.statusCode === "number" && typeof error.error === "string") {
      res.status(error.statusCode).json({ error: error.error });
      return;
    }

    // Unhandled fallback error handler (never crash!)
    console.error("Unexpected audit error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred while auditing the URL.",
    });
  }
}
