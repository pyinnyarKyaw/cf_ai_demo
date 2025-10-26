/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
  LYRICS_KV: KVNamespace;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

	//handle POST /generate
    if (url.pathname === "/generate" && request.method === "POST") {
      const { theme, genre } = await request.json<{ theme: string; genre: string }>();
      const prompt = `Write ${genre} song lyrics about ${theme}.`;

      const aiResponse: any = await env.AI.run(
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        { prompt }
      );

      const lyrics =
        aiResponse?.output_text ||
        aiResponse?.response ||
        aiResponse?.text ||
        JSON.stringify(aiResponse);

      //store in KV
      const id = Date.now().toString();
      await env.LYRICS_KV.put(id, JSON.stringify({ theme, genre, lyrics }));

      //keep only last 5
      const keys = await env.LYRICS_KV.list();
      if (keys.keys.length > 5) {
        await env.LYRICS_KV.delete(keys.keys[0].name);
      }

      return new Response(JSON.stringify({ lyrics }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    //endpoint to fetch history
    if (url.pathname === "/history") {
      const keys = await env.LYRICS_KV.list();
      const items = await Promise.all(
        keys.keys.map(async (k) => JSON.parse(await env.LYRICS_KV.get(k.name) || "{}"))
      );
      return new Response(JSON.stringify(items.reverse()), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
