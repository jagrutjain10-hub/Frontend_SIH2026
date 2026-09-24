# AIRPRICE INDIA frontend
Next.js 14 + TypeScript, no extra UI/chart dependencies.
1. `cp .env.example .env.local` and set `NEXT_PUBLIC_API_URL` to your Render API URL.
2. `npm install && npm run dev`
The browser calls `/backend/*`, which Next proxies to `NEXT_PUBLIC_API_URL` (the FastAPI app has no CORS middleware).
Only `/health` and `/index/latest` exist in api.py; other modules show honest "not exposed" states via adapters in `lib/api.ts`.
