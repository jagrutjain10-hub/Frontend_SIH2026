// All backend access lives here. Only endpoints that exist in api.py are implemented.
export interface IndexPoint { origin: string; destination: string; base_period: string; index_value: number; n_observations: number; computed_at_utc: string }
export interface Health { status: string }
export type ErrKind = "offline" | "timeout" | "not_found" | "malformed" | "http";
export class ApiError extends Error { constructor(public kind: ErrKind, message: string) { super(message); } }

const BASE = "/backend"; // proxied to NEXT_PUBLIC_API_URL, see next.config.mjs

async function get<T>(path: string, check: (v: unknown) => v is T, ms = 45000): Promise<T> {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  try {
    const r = await fetch(BASE + path, { signal: c.signal, cache: "no-store" });
    if (r.status === 404) throw new ApiError("not_found", `${path} returned 404`);
    if (r.status >= 500 && r.status <= 504 && r.status !== 500) throw new ApiError("offline", "The backend service could not be reached.");
    if (!r.ok) throw new ApiError("http", `${path} returned HTTP ${r.status}`);
    let j: unknown; try { j = await r.json(); } catch { throw new ApiError("malformed", "Response was not valid JSON."); }
    if (!check(j)) throw new ApiError("malformed", "Response did not match the expected shape.");
    return j;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if ((e as Error).name === "AbortError") throw new ApiError("timeout", "Request timed out. The Render service may be cold-starting.");
    throw new ApiError("offline", "The backend service could not be reached.");
  } finally { clearTimeout(t); }
}
const isHealth = (v: unknown): v is Health => typeof v === "object" && v !== null && typeof (v as Health).status === "string";
const isIndex = (v: unknown): v is IndexPoint[] => Array.isArray(v) && v.every(o => o && typeof o.origin === "string" && typeof o.destination === "string" && typeof o.index_value === "number" && typeof o.n_observations === "number");

export const getHealth = () => get("/health", isHealth);
export const getLatestIndex = () => get("/index/latest", isIndex);

// TODO adapters: these backend features exist in the pipeline (or docs) but have NO endpoint in api.py.
// Connect them here when endpoints are added; UI already calls through these.
const notExposed = (what: string): never => { throw new ApiError("not_found", `${what} is not exposed by the API.`); };
export const searchMockFares = (_q: { origin: string; destination: string; date: string }) => notExposed("/mock-airline/search");
export const getAnomalies = () => notExposed("Anomaly results");
export const getObservations = () => notExposed("Fare observations");
export const getQualityCounts = () => notExposed("Cleaning statistics");

export const ENDPOINTS = [
  { path: "GET /health", state: "live", note: "Returns {\"status\":\"ok\"}. Does not check the database." },
  { path: "GET /index/latest", state: "live", note: "Latest row per route from airfare_index." },
  { path: "GET /mock-airline/search", state: "absent", note: "Not present in api.py in the repo provided." },
  { path: "Observations / quality / anomalies / booking windows", state: "absent", note: "Pipeline modules with no API endpoint." },
] as const;
