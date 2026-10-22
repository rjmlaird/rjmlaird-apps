// Kinship Notes is a client-only app: GEDCOM files and notes never leave the browser.
// Static assets (and their security headers, see public/_headers) are served by Workers
// Assets directly. This Worker only handles /api/* (see run_worker_first in wrangler.jsonc).
interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/health") return Response.json({ ok: true });
    return env.ASSETS.fetch(req);
  },
};
