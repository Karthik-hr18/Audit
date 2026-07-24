# ⚡ Page Pulse — Production Web Auditor API & Dashboard

> **Built for Digital Heroes Training Task** — [digitalheroesco.com](https://digitalheroesco.com)

Page Pulse is a light, production-ready web tool and microservice API that audits any URL. It fetches target web pages, measures response timings, extracts key SEO metrics (`<title>`, meta description, `<h1>` heading count), counts accessibility flaws (`<img>` missing `alt` text), and calculates body word count—all backed by defensive error handling that never crashes.

---

## 🚀 Live Demo & Links

- **Live Frontend Application**: [Page Pulse Live App](https://page-pulse-lovat.vercel.app/)
- **Live API Endpoint**: `POST https://audit-ge26.onrender.com/api/audit`
- **Loom Walkthrough**: [Watch Loom Demo](https://loom.com) *(Insert Loom URL here)*

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Node.js, Express, TypeScript, Axios, Cheerio, Vitest
- **Frontend**: React 19, Vite, TypeScript, Vanilla CSS (Glassmorphism design system)
- **Architecture**: Separated Layer Architecture (Controller → Service → Pure Parser)

```
[ Client Interface ] 
        │  POST /api/audit { url: "https://example.com" }
        ▼
[ Express Router ] ──► [ Audit Controller ] 
                            │
                            ▼
                    [ Audit Service ] ── (Axios Timeout / Header Validation)
                            │
                            ▼
                    [ Page Parser ]    ── (Cheerio pure HTML extraction)
```

---

## 💻 Quickstart Setup Guide

### 1. Backend Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run unit tests
npm test

# Start local development server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Client Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173 or http://localhost:3000)
npm run dev
```

---

## 📖 API Contract & Specification

### `POST /api/audit`

Audits a web page URL and returns calculated metrics.

#### Request Headers
`Content-Type: application/json`

#### Request Body
```json
{
  "url": "https://example.com"
}
```

#### Success Response (`200 OK`)
```json
{
  "url": "https://example.com",
  "status": 200,
  "responseTimeMs": 245,
  "title": "Example Domain",
  "metaDescription": null,
  "h1Count": 1,
  "missingAltImages": 0,
  "wordCount": 125
}
```

#### Error Response Schema (`400`, `422`, `504`, `502`)
```json
{
  "error": "Target URL returned non-HTML content type (image/png). Page Pulse can only audit HTML web pages."
}
```

---

## 🧠 3 Engineering Design Decisions & Reasoning

### 1. Pure-Function Parsing Architecture (`parserService.ts`)
- **Decision**: HTML parsing is completely decoupled into a pure function (`parseHtml(html: string)`), isolated from network fetching.
- **Reasoning**: Decoupling parsing from I/O allows zero-network, ultra-fast unit testing (Task B requirement). Tests execute in under 20ms using raw HTML strings without needing mock HTTP servers or brittle network interceptions.

### 2. Defensive Response Whitelisting & Strict Timeout Controls
- **Decision**: Requests enforce a strict 8-second timeout (`TIMEOUT_MS = 8000`) and inspect the `content-type` header prior to parsing. Non-HTML content types (PDFs, PNGs, ZIPs, streaming media) are rejected with a clean `422 Unprocessable Entity` status.
- **Reasoning**: Without header whitelisting, fetching binary files or huge file streams could cause memory leaks or hang the process indefinitely. Defensive validation ensures the backend remains responsive under all conditions.

### 3. Unified Error Schema & Crash-Proof Middleware
- **Decision**: Network failures (DNS resolution errors `ENOTFOUND`, connection refusals `ECONNREFUSED`, timeouts `ECONNABORTED`) and HTTP error codes (404, 500) are caught and mapped to structured JSON error objects `{ error: string }`.
- **Reasoning**: Production APIs should never crash or return raw HTML stack trace errors to client applications. Catching and standardizing error structures guarantees predictable client handling and optimal UX.

---

## 🧪 Unit Testing (Task B Requirement)

Unit tests cover the parsing engine happy path as well as key edge/failure cases:

1. **Happy Path**: Verifies title extraction, meta description, `<h1>` heading count, missing `alt` images count, and text body word count.
2. **Failure Case 1 (Empty/Null Input)**: Ensures empty HTML strings or null values return zeroed/null-safe metric objects without throwing exceptions.
3. **Failure Case 2 (Missing Metadata & Whitespace Alts)**: Tests documents missing `<title>` and `<meta name="description">` tags, multi-image alt validation (including whitespace `alt="   "` and missing attributes), and verifies `<script>` tag text is ignored in word counts.

```bash
# Run backend tests
cd server
npm test
```

---

---

## 🤖 AI Usage Disclosure & Engineering Iterations

**Where AI Was Used**: AI was utilized as a senior engineering mentor during the initial project breakdown—assisting with project architecture layering (separating Controller, Service, and Parser), outlining edge-case error scenarios (timeouts, DNS failures, non-HTML responses), and writing boilerplate configuration files.

**What I Changed & Decided Afterwards**:
1. **Decoupled Pure Parser**: Refactored the Cheerio HTML parsing into a standalone pure function (`parseHtml`), enabling zero-network unit tests running in under 20ms.
2. **AWS WAF & Bot Challenge Detection**: Identified that major platforms (like IMDb) return `202 Accepted` with AWS WAF challenge scripts. Created explicit WAF detection logic and built an interactive warning banner on the frontend UI.
3. **Defensive I/O Controls**: Configured `rejectUnauthorized: false` for legacy SSL handshakes, updated browser headers to prevent anti-bot blocks, and implemented strict timeout handling to ensure the backend never crashes.

