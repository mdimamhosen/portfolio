import type { Connect, Plugin } from "vite";
import { loadEnv } from "vite";

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: Connect.ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.end(JSON.stringify(payload));
}

/**
 * Serves /api/* during `vite` so chat/tracking work without `vercel dev`.
 */
export function localApiPlugin(mode: string): Plugin {
  return {
    name: "portfolio-local-api",
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/")) {
          next();
          return;
        }

        const pathname = url.split("?")[0];

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
          res.end();
          return;
        }

        try {
          if (pathname === "/api/chat" && req.method === "POST") {
            if (!process.env.DEEPSEEK_API_KEY) {
              sendJson(res, 503, { error: "DEEPSEEK_API_KEY is not configured" });
              return;
            }

            const raw = await readBody(req);
            const body = raw ? JSON.parse(raw) : {};
            const message = typeof body.message === "string" ? body.message : "";
            const history = Array.isArray(body.history) ? body.history : [];

            if (!message.trim()) {
              sendJson(res, 400, { error: "message is required" });
              return;
            }

            const { answerWithRag } = await server.ssrLoadModule("/api/_lib/rag.ts");
            const result = await answerWithRag(message, history);
            sendJson(res, 200, result);
            return;
          }

          if (pathname === "/api/ingest" && (req.method === "GET" || req.method === "POST")) {
            const { buildEmbeddings, listKnowledge } = await server.ssrLoadModule("/api/_lib/rag.ts");
            const store = await buildEmbeddings(true);
            sendJson(res, 200, {
              ok: true,
              provider: "deepseek",
              retrieval: "lexical",
              chunks: store.length,
              knowledge: listKnowledge().map((c: { id: string; title: string; category: string }) => ({
                id: c.id,
                title: c.title,
                category: c.category,
              })),
            });
            return;
          }

          // Let Vite/other handlers deal with remaining /api routes (or 404).
          next();
        } catch (error) {
          console.error("[local-api]", error);
          sendJson(res, 500, {
            error: "Local API failed",
            detail: error instanceof Error ? error.message : String(error),
          });
        }
      });
    },
  };
}
