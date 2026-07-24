import { Router } from "express";
import { handleAuditRequest } from "../controllers/auditController";

const router = Router();

// POST /api/audit
router.post("/audit", handleAuditRequest);

export default router;
