import { Router } from "express";

const router = Router();

router.get("/biography", async (req, res) => {
  const name = req.query.name as string;
  if (!name) {
    res.status(400).json({ found: false, error: "name query param required" });
    return;
  }

  const headers = {
    'Api-User-Agent': 'MystiqueCompass/1.0 (https://github.com/mystique-compass; contact@example.com)'
  };

  // Hard timeout so a stalled/unreachable Wikipedia never leaves the request
  // hanging — the client's resilient fallback (direct browser fetch) kicks in
  // as soon as it gets a response (including this timeout's error), instead
  // of waiting indefinitely on a dead connection.
  const TIMEOUT_MS = 6000;
  async function fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fetch(url, { headers, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
    const searchResp = await fetchWithTimeout(searchUrl);
    if (!searchResp.ok) {
      res.status(200).json({ found: false, error: `Wikipedia search failed: ${searchResp.statusText}` });
      return;
    }
    const searchData = await searchResp.json() as any;

    const results = searchData?.query?.search ?? [];
    if (!results.length) {
      res.json({ found: false });
      return;
    }

    const pageId = results[0].pageid;
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=revisions|categories&rvprop=content&rvslots=main&format=json&origin=*`;
    const extractResp = await fetchWithTimeout(extractUrl);
    if (!extractResp.ok) {
      res.status(200).json({ found: false, error: `Wikipedia extract failed: ${extractResp.statusText}` });
      return;
    }
    const extractData = await extractResp.json() as any;

    const page = extractData?.query?.pages?.[pageId];
    if (!page) {
      res.json({ found: false });
      return;
    }

    const title = page.title as string;
    const content = page?.revisions?.[0]?.slots?.main?.["*"] as string ?? "";

    // Comprehensive regexes for Wikipedia birth date formats
    const birthDateTemplates = [
      /\{\{birth date(?: and age)?\s*\|(?:df=[^|]*\|)?(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
      /\{\{birth date\s*\|(?:df=[^|]*\|)?(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
      /\|\s*birth_date\s*=\s*\{\{birth date(?: and age)?\s*\|(?:df=[^|]*\|)?(\d{4})\|(\d{1,2})\|(\d{1,2})/i,
      /\|\s*birth_date\s*=\s*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
      /\|\s*birth_date\s*=\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})/i,
      /birth_date\s*=.*?(\d{4})-(\d{1,2})-(\d{1,2})/,
      /\|\s*birth_date\s*=.*?(\d{1,2})\s*[|,]\s*(\d{1,2})\s*[|,]\s*(\d{4})/
    ];

    let birthYear: number | null = null;
    let birthMonth: number | null = null;
    let birthDay: number | null = null;

    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    for (const regex of birthDateTemplates) {
      const match = content.match(regex);
      if (match) {
        if (regex.source.includes("(January|")) {
          // Handle named months
          if (isNaN(parseInt(match[1]))) {
            // Month name is first: match[1]=Month, match[2]=Day, match[3]=Year
            birthMonth = months.indexOf(match[1].toLowerCase()) + 1;
            birthDay = parseInt(match[2]);
            birthYear = parseInt(match[3]);
          } else {
            // Day is first: match[1]=Day, match[2]=Month, match[3]=Year
            birthDay = parseInt(match[1]);
            birthMonth = months.indexOf(match[2].toLowerCase()) + 1;
            birthYear = parseInt(match[3]);
          }
        } else {
          // Standard numeric matches
          if (match[1].length === 4) {
            // YYYY-MM-DD format
            birthYear = parseInt(match[1]);
            birthMonth = parseInt(match[2]);
            birthDay = parseInt(match[3]);
          } else {
            // DD-MM-YYYY format
            birthDay = parseInt(match[1]);
            birthMonth = parseInt(match[2]);
            birthYear = parseInt(match[3]);
          }
        }
        break;
      }
    }

    if (!birthYear) {
      const yearMatch = content.match(/born.*?(\d{4})/i);
      if (yearMatch) {
        birthYear = parseInt(yearMatch[1]);
        birthMonth = 1;
        birthDay = 1;
      }
    }

    const genderMale = /\b(he|his|him|actor|king|emperor|pope|prince|duke|lord|mr\.)\b/i.test(content);
    const genderFemale = /\b(she|her|hers|actress|queen|empress|princess|duchess|lady|mrs\.)\b/i.test(content);
    const gender = genderFemale ? "female" : "male";

    const descriptionMatch = content.match(/'''[^']+'''\s*\(([^)]{5,80})\)/);
    const description = descriptionMatch ? descriptionMatch[1] : "";

    if (!birthYear) {
      res.json({ found: false, title });
      return;
    }

    res.json({
      found: true,
      title,
      description,
      birthYear,
      birthMonth,
      birthDay,
      gender,
      wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    });
  } catch (err) {
    req.log?.error({ err }, "Biography fetch error");
    const isAbort = err instanceof Error && err.name === "AbortError";
    // Respond 200 (not 500) so the client's fallback logic treats this the
    // same as any other "our hosting couldn't complete this" case and moves
    // straight on to fetching Wikipedia directly, instead of surfacing a
    // hard server error to the user.
    res.status(200).json({ found: false, error: isAbort ? "Wikipedia request timed out" : "internal error" });
  }
});

export default router;
