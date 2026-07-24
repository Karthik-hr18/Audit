import { describe, it, expect } from "vitest";
import { parseHtml } from "../services/parserService";

describe("parserService - parseHtml Unit Tests", () => {
  // 1. HAPPY PATH TEST
  it("should correctly parse a fully-formed HTML document (Happy Path)", () => {
    const validHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Digital Heroes - Page Pulse</title>
          <meta name="description" content="Audit web pages for SEO and performance metrics." />
        </head>
        <body>
          <h1>Welcome to Page Pulse Audit Tool</h1>
          <p>This tool fetches web pages and extracts key metrics cleanly.</p>
          <img src="logo.png" alt="Company Logo" />
          <img src="banner.png" /> <!-- Missing Alt -->
        </body>
      </html>
    `;

    const result = parseHtml(validHtml);

    expect(result.title).toBe("Digital Heroes - Page Pulse");
    expect(result.metaDescription).toBe("Audit web pages for SEO and performance metrics.");
    expect(result.h1Count).toBe(1);
    expect(result.missingAltImages).toBe(1);
    expect(result.wordCount).toBeGreaterThan(5);
  });

  // 2. FAILURE / EDGE CASE 1: Empty or Invalid Input
  it("should handle empty or non-string HTML input gracefully without crashing", () => {
    const emptyResult = parseHtml("");
    expect(emptyResult.title).toBeNull();
    expect(emptyResult.metaDescription).toBeNull();
    expect(emptyResult.h1Count).toBe(0);
    expect(emptyResult.missingAltImages).toBe(0);
    expect(emptyResult.wordCount).toBe(0);

    const nullResult = parseHtml(null as any);
    expect(nullResult.title).toBeNull();
    expect(nullResult.metaDescription).toBeNull();
    expect(nullResult.h1Count).toBe(0);
  });

  // 3. FAILURE / EDGE CASE 2: Missing Meta Description, Title & Multiple Missing Alt Images
  it("should handle HTML documents missing title, meta description, and containing multiple un-alt'd images", () => {
    const sparseHtml = `
      <html>
        <head>
          <!-- No title tag and no meta description -->
        </head>
        <body>
          <h2>Subheading but no H1</h2>
          <img src="pic1.jpg" alt="" /> <!-- Empty Alt -->
          <img src="pic2.jpg" /> <!-- No Alt attribute -->
          <img src="pic3.jpg" alt="   " /> <!-- Whitespace Alt -->
          <script>console.log('Ignore script text in word count');</script>
        </body>
      </html>
    `;

    const result = parseHtml(sparseHtml);

    expect(result.title).toBeNull();
    expect(result.metaDescription).toBeNull();
    expect(result.h1Count).toBe(0);
    expect(result.missingAltImages).toBe(3);
    expect(result.wordCount).toBe(4); // "Subheading but no H1" = 4 words
  });
});
