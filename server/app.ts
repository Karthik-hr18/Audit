import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import auditRoutes from "./routes/auditRoutes";

const app = express();

app.use(
  cors({
    origin: "*", // Allow cross-origin requests for testing and deployment
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Page Pulse API" });
});

// API Routes
app.use("/api", auditRoutes);

// 404 Not Found Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Global Error Middleware (Ensures backend NEVER crashes)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error.",
  });
});

export default app;
