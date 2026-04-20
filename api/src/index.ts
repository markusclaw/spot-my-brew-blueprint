/**
 * Cloudflare Workers API
 *
 * Phase A: Mock data layer (no D1 yet)
 * Phase B: Replace MockDB calls with real D1 queries
 */

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
}

// ─── CORS helpers ───
function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(data: unknown, status = 200, env?: Env): Response {
  const origin = env?.CORS_ORIGIN || "*";
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

// ─── Mock data layer (Phase A) ───
// Replace these with real D1 queries in Phase B
const MockDB = {
  items: [
    { id: "1", name: "Sample Item", status: "active", createdAt: new Date().toISOString() },
    { id: "2", name: "Another Item", status: "draft", createdAt: new Date().toISOString() },
  ],

  async getAll() {
    return this.items;
  },

  async getById(id: string) {
    return this.items.find(item => item.id === id) || null;
  },

  async create(data: { name: string; status?: string }) {
    const item = {
      id: String(this.items.length + 1),
      name: data.name,
      status: data.status || "draft",
      createdAt: new Date().toISOString(),
    };
    this.items.push(item);
    return item;
  },

  async update(id: string, data: Partial<{ name: string; status: string }>) {
    const item = this.items.find(i => i.id === id);
    if (!item) return null;
    Object.assign(item, data);
    return item;
  },

  async delete(id: string) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    return true;
  },
};

// ─── Router ───
type RouteHandler = (request: Request, env: Env, params: Record<string, string>) => Promise<Response>;

interface Route {
  method: string;
  pattern: RegExp;
  handler: RouteHandler;
}

const routes: Route[] = [
  // Health check
  {
    method: "GET",
    pattern: /^\/api\/health$/,
    handler: async (_req, env) => jsonResponse({ status: "ok", environment: env.ENVIRONMENT, timestamp: new Date().toISOString() }, 200, env),
  },

  // GET /api/items — list all
  {
    method: "GET",
    pattern: /^\/api\/items$/,
    handler: async (_req, env) => {
      const items = await MockDB.getAll();
      return jsonResponse({ data: items, count: items.length }, 200, env);
    },
  },

  // GET /api/items/:id — get one
  {
    method: "GET",
    pattern: /^\/api\/items\/(?<id>[^/]+)$/,
    handler: async (_req, env, params) => {
      const item = await MockDB.getById(params.id);
      if (!item) return jsonResponse({ error: "Not found" }, 404, env);
      return jsonResponse({ data: item }, 200, env);
    },
  },

  // POST /api/items — create
  {
    method: "POST",
    pattern: /^\/api\/items$/,
    handler: async (req, env) => {
      const body = await req.json() as { name: string; status?: string };
      if (!body.name) return jsonResponse({ error: "name is required" }, 400, env);
      const item = await MockDB.create(body);
      return jsonResponse({ data: item }, 201, env);
    },
  },

  // PUT /api/items/:id — update
  {
    method: "PUT",
    pattern: /^\/api\/items\/(?<id>[^/]+)$/,
    handler: async (req, env, params) => {
      const body = await req.json() as Partial<{ name: string; status: string }>;
      const item = await MockDB.update(params.id, body);
      if (!item) return jsonResponse({ error: "Not found" }, 404, env);
      return jsonResponse({ data: item }, 200, env);
    },
  },

  // DELETE /api/items/:id — delete
  {
    method: "DELETE",
    pattern: /^\/api\/items\/(?<id>[^/]+)$/,
    handler: async (_req, env, params) => {
      const ok = await MockDB.delete(params.id);
      if (!ok) return jsonResponse({ error: "Not found" }, 404, env);
      return jsonResponse({ success: true }, 200, env);
    },
  },
];

// ─── Main fetch handler ───
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(env.CORS_ORIGIN),
      });
    }

    // Match route
    for (const route of routes) {
      if (route.method !== method) continue;
      const match = url.pathname.match(route.pattern);
      if (match) {
        const params = match.groups || {};
        try {
          return await route.handler(request, env, params);
        } catch (err) {
          console.error("Route error:", err);
          return jsonResponse({ error: "Internal server error" }, 500, env);
        }
      }
    }

    return jsonResponse({ error: "Not found", path: url.pathname }, 404, env);
  },
};
