import * as cheerio from "cheerio";

export interface ParsedPageData {
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  missingAltImages: number;
  wordCount: number;
  isBotProtected?: boolean;
}

/**
 * Parses raw HTML string using Cheerio and extracts page metrics.
 * Pure function: network-independent and deterministic for unit testing.
 */
export function parseHtml(htmlContent: string): ParsedPageData {
  if (!htmlContent || typeof htmlContent !== "string") {
    return {
      title: null,
      metaDescription: null,
      h1Count: 0,
      missingAltImages: 0,
      wordCount: 0,
      isBotProtected: false,
    };
  }

  const $ = cheerio.load(htmlContent);

  // Check for common WAF / Bot Challenges (AWS WAF, Cloudflare, Akamai)
  const lowerHtml = htmlContent.toLowerCase();
  const isBotProtected =
    lowerHtml.includes("awswaf") ||
    lowerHtml.includes("challenge.js") ||
    lowerHtml.includes("cf-challenge") ||
    lowerHtml.includes("captcha");

  // 1. Page Title
  const titleText = $("title").first().text().trim();
  const title = titleText.length > 0 ? titleText : null;

  // 2. Meta Description (check name="description" first, fallback to property="og:description")
  let description: string | null = null;
  const metaDesc = $('meta[name="description" i]').attr("content");
  const ogDesc = $('meta[property="og:description" i]').attr("content");

  if (metaDesc && metaDesc.trim().length > 0) {
    description = metaDesc.trim();
  } else if (ogDesc && ogDesc.trim().length > 0) {
    description = ogDesc.trim();
  }

  // 3. H1 Count
  const h1Count = $("h1").length;

  // 4. Images missing alt text
  let missingAltImages = 0;
  $("img").each((_, element) => {
    const alt = $(element).attr("alt");
    if (alt === undefined || alt === null || alt.trim() === "") {
      missingAltImages++;
    }
  });

  // 5. Approximate Word Count
  const bodyClone = $("body").clone();
  bodyClone.find("script, style, noscript, svg, iframe, code, style").remove();
  const bodyText = bodyClone.text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.length > 0 ? bodyText.split(" ").filter(Boolean).length : 0;

  return {
    title,
    metaDescription: description,
    h1Count,
    missingAltImages,
    wordCount,
    isBotProtected,
  };
}
