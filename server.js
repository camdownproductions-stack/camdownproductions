import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT || 5173);
const PUBLIC_DIR = join(process.cwd(), "public");

const accounts = [
  {
    handle: "camdownproductions",
    label: "Camdown Productions",
    url: "https://www.instagram.com/camdownproductions/",
    role: "Films, events, and production stories"
  },
  {
    handle: "framingpicturesby_k.s",
    label: "Framing Pictures by K.S",
    url: "https://www.instagram.com/framingpicturesby_k.s/",
    role: "Portraits, frames, and visual details"
  }
];

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function json(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "s-maxage=300, stale-while-revalidate=600"
  });
  res.end(JSON.stringify(body));
}

function titleFromCaption(caption = "", index) {
  const clean = caption
    .replace(/#[\w.]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return `Instagram Feature ${index + 1}`;
  const firstLine = clean.split(/[.!?\n]/)[0].trim();
  return firstLine.length > 64 ? `${firstLine.slice(0, 61)}...` : firstLine;
}

function normalizeMedia(item, account, index) {
  return {
    id: item.id,
    account: account.label,
    handle: account.handle,
    title: titleFromCaption(item.caption, index),
    caption: item.caption || "",
    mediaType: item.media_type,
    image: item.thumbnail_url || item.media_url,
    permalink: item.permalink,
    timestamp: item.timestamp
  };
}

async function fetchInstagramMedia() {
  const token = process.env.IG_GRAPH_ACCESS_TOKEN;
  const ids = (process.env.IG_GRAPH_ACCOUNT_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || !ids.length) {
    return {
      live: false,
      setupRequired: true,
      accounts,
      items: []
    };
  }

  const accountIds = ids.slice(0, accounts.length);
  const responses = await Promise.all(
    accountIds.map(async (id, accountIndex) => {
      const params = new URLSearchParams({
        fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
        limit: "12",
        access_token: token
      });
      const url = `https://graph.facebook.com/v20.0/${id}/media?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Instagram API request failed for ${id}: ${detail}`);
      }

      const payload = await response.json();
      const account = accounts[accountIndex] || accounts[0];
      return (payload.data || []).map((item, index) => normalizeMedia(item, account, index));
    })
  );

  return {
    live: true,
    setupRequired: false,
    accounts,
    items: responses
      .flat()
      .filter((item) => item.image && item.permalink)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 18)
  };
}

async function serveStatic(req, res) {
  const requestPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const safePath = normalize(requestPath === "/" ? "/index.html" : requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const content = await readFile(filePath);
    res.writeHead(200, {
      "content-type": contentTypes[extname(filePath)] || "application/octet-stream"
    });
    res.end(content);
  } catch {
    const content = await readFile(join(PUBLIC_DIR, "index.html"));
    res.writeHead(200, { "content-type": contentTypes[".html"] });
    res.end(content);
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/api/instagram") {
    try {
      json(res, 200, await fetchInstagramMedia());
    } catch (error) {
      json(res, 502, {
        live: false,
        setupRequired: false,
        accounts,
        items: [],
        error: error.message
      });
    }
    return;
  }

  await serveStatic(req, res);
}).listen(PORT, () => {
  console.log(`Camdown portfolio running at http://localhost:${PORT}`);
});
