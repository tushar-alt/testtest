export default async function handler(req, res) {
  try {
    const path = (req.query.path || "").toString().trim();

    if (!path) {
      res.status(400).json({ error: "Missing ?path=" });
      return;
    }

    const base = "https://www.nseindia.com/api/";
    const apiUrl = base + path.replace(/^\/+/, "");

    // 1) Warm-up request to get cookies (NSE often expects them)
    const home = await fetch("https://www.nseindia.com/", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    // Grab cookies (best-effort). Some environments merge set-cookie; still works often.
    const setCookie = home.headers.get("set-cookie") || "";

    // 2) Actual API request
    const apiResp = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.nseindia.com/",
        "Cookie": setCookie, // best-effort cookie pass-through
      },
    });

    const bodyText = await apiResp.text();

    // Allow browser access to YOUR endpoint
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    // Optional: small caching to reduce blocks (you can tune)
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=30");

    res.status(apiResp.status).send(bodyText);
  } catch (err) {
    res.status(500).json({
      error: "Proxy failed",
      message: String(err?.message || err),
    });
  }
}
