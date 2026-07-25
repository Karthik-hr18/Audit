import { useState } from "react";
import "./App.css";
import heroImg from "./assets/hero.png";

interface AuditResult {
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (targetUrl?: string) => {
    const inputUrl = (targetUrl || url).trim();
    if (!inputUrl) {
      setError("Please enter a URL to audit.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to audit page.`);
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while auditing the page.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (presetUrl: string) => {
    setUrl(presetUrl);
    handleAudit(presetUrl);
  };

  return (
    <div className="app-container">
      {/* Premium Tech Hero Section */}
      <section className="hero-section">
        <div className="hero-text-content">
          <div className="brand-badge">
            <span className="pulse-dot"></span>
            Page Pulse Web Auditor 2.0
          </div>
          <h1 className="app-title">Audit & Optimize Any Web Page in Real Time</h1>
          <p className="app-subtitle">
            Extract instant SEO metrics, response timing, heading counts, and image accessibility details with high-speed precision.
          </p>

          <div className="hero-feature-pills">
            <div className="feature-pill">
              <span>⚡</span> 20ms Pure Parsing
            </div>
            <div className="feature-pill">
              <span>🛡️</span> AWS WAF Aware
            </div>
            <div className="feature-pill">
              <span>🎯</span> Zero-Crash Core
            </div>
          </div>
        </div>

        {/* Hero Visual Showcase with Rounded Curved Container & Floating Badges */}
        <div className="hero-visual-wrapper">
          <div className="ambient-glow-orb"></div>

          {/* Floating Badge Top Left */}
          <div className="floating-badge floating-badge-top">
            <span className="badge-icon">🚀</span>
            <div>
              <div className="badge-text-primary">99.8% Audit Speed</div>
              <div className="badge-text-secondary">Instant Parsing Engine</div>
            </div>
          </div>

          {/* Curved Glassmorphism Image Container */}
          <div className="hero-image-card">
            <img
              src={heroImg}
              alt="Page Pulse Analytics Dashboard"
              className="hero-img"
            />
          </div>

          {/* Floating Badge Bottom Right */}
          <div className="floating-badge floating-badge-bottom">
            <span className="badge-icon">🛡️</span>
            <div>
              <div className="badge-text-primary">Defensive I/O</div>
              <div className="badge-text-secondary">100% Fail-safe API</div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Input Form */}
      <div className="audit-form-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAudit();
          }}
        >
          <div className="input-group">
            <input
              type="text"
              className="url-input"
              placeholder="Enter web address (e.g., example.com or https://wikipedia.org)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Auditing...
                </>
              ) : (
                <>Audit Page</>
              )}
            </button>
          </div>
        </form>

        {/* Quick Test Presets */}
        <div className="presets-container">
          <span className="presets-label">Try example:</span>
          <button
            type="button"
            className="preset-chip"
            onClick={() => handlePreset("https://example.com")}
          >
            example.com
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => handlePreset("https://digitalheroesco.com")}
          >
            digitalheroesco.com
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => handlePreset("https://httpstat.us/500")}
          >
            500 Error Test
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => handlePreset("https://httpbin.org/image/png")}
          >
            Non-HTML Test
          </button>
        </div>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div>
            <div className="error-title">Audit Failed</div>
            <div className="error-message">{error}</div>
          </div>
        </div>
      )}

      {/* Audit Results Dashboard */}
      {result && (
        <div className="results-dashboard">
          <div className="results-header">
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                Audited Endpoint
              </span>
              <span className="audited-url">{result.url}</span>
            </div>
            <div className="badge badge-success">Audit Complete</div>
          </div>

          {/* Bot Protection / WAF Challenge Warning Banner */}
          {(result.isBotProtected || result.status === 202) && (
            <div
              style={{
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: "1.2rem", lineHeight: 1 }}>🛡️</div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--accent-amber)", fontSize: "0.95rem" }}>
                  Bot Challenge / WAF Interception Detected (HTTP 202)
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  The target website (e.g., IMDb/AWS WAF) intercepted automated requests with a JavaScript verification challenge instead of serving full HTML content.
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="metrics-grid">
            {/* Status Code */}
            <div className="metric-card">
              <div className="metric-label">HTTP Status</div>
              <div className="metric-value-row">
                <span className="metric-value">{result.status}</span>
                <span
                  className={`badge ${
                    result.status === 200
                      ? "badge-success"
                      : result.status === 202
                      ? "badge-warning"
                      : result.status >= 400 && result.status < 500
                      ? "badge-warning"
                      : "badge-danger"
                  }`}
                >
                  {result.status === 200
                    ? "OK"
                    : result.status === 202
                    ? "202 Challenge"
                    : `HTTP ${result.status}`}
                </span>
              </div>
            </div>

            {/* Response Time */}
            <div className="metric-card">
              <div className="metric-label">Response Time</div>
              <div className="metric-value-row">
                <span className="metric-value">{result.responseTimeMs}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>ms</span>
                <span
                  className={`badge ${
                    result.responseTimeMs < 500
                      ? "badge-success"
                      : result.responseTimeMs < 1500
                      ? "badge-warning"
                      : "badge-danger"
                  }`}
                >
                  {result.responseTimeMs < 500
                    ? "Fast"
                    : result.responseTimeMs < 1500
                    ? "Moderate"
                    : "Slow"}
                </span>
              </div>
            </div>

            {/* H1 Count */}
            <div className="metric-card">
              <div className="metric-label">H1 Headings</div>
              <div className="metric-value-row">
                <span className="metric-value">{result.h1Count}</span>
                <span
                  className={`badge ${
                    result.h1Count === 1
                      ? "badge-success"
                      : result.h1Count === 0
                      ? "badge-warning"
                      : "badge-warning"
                  }`}
                >
                  {result.h1Count === 1
                    ? "Optimal"
                    : result.h1Count === 0
                    ? "No H1"
                    : "Multiple H1s"}
                </span>
              </div>
            </div>

            {/* Missing Alt Images */}
            <div className="metric-card">
              <div className="metric-label">Missing Alt Images</div>
              <div className="metric-value-row">
                <span className="metric-value">{result.missingAltImages}</span>
                <span
                  className={`badge ${
                    result.missingAltImages === 0 ? "badge-success" : "badge-warning"
                  }`}
                >
                  {result.missingAltImages === 0 ? "Accessible" : "Needs Alt Text"}
                </span>
              </div>
            </div>

            {/* Word Count */}
            <div className="metric-card" style={{ gridColumn: "span 1" }}>
              <div className="metric-label">Approx. Word Count</div>
              <div className="metric-value-row">
                <span className="metric-value">{result.wordCount.toLocaleString()}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>words</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            {/* Page Title */}
            <div className="detail-card">
              <div className="detail-title">
                📌 Page Title (`&lt;title&gt;`)
              </div>
              <div className={`detail-content ${!result.title ? "empty" : ""}`}>
                {result.title || "No <title> tag found on this page."}
              </div>
            </div>

            {/* Meta Description */}
            <div className="detail-card">
              <div className="detail-title">
                📝 Meta Description (`&lt;meta name="description"&gt;`)
              </div>
              <div className={`detail-content ${!result.metaDescription ? "empty" : ""}`}>
                {result.metaDescription || "No meta description attribute found on this page."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Live Build Credit Footer */}
      <footer className="app-footer">
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Built for{" "}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="credit-link"
          >
            Digital Heroes Training Task
          </a>
        </p>
      </footer>
    </div>
  );
}
