// The FastAPI service has no CORS middleware, so the browser calls /backend/* on this
// app and Next proxies it to NEXT_PUBLIC_API_URL. No backend change needed.
const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
export default {
  eslint: { ignoreDuringBuilds: true },
  async rewrites() { return [{ source: "/backend/:path*", destination: `${api}/:path*` }]; },
};
