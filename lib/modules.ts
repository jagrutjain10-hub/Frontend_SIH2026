export interface Mod { title: string; sub: string; status: "planned" | "static"; notice: string; controls?: string[]; blocks: { h: string; items: string[] }[]; steps?: string[] }
const NOAPI = "Analysis module exists in the pipeline but is not currently exposed through the API.";
export const MODULES: Record<string, Mod> = {
  "fare-lookup": { title: "Fare Lookup", sub: "Demo search", status: "planned", notice: "API endpoint not available. /mock-airline/search is not defined in api.py, so no results are shown.", controls: ["Origin", "Destination", "Departure date"], blocks: [{ h: "When connected", items: ["Results will come only from the API: flight identifier, departure, arrival, fare and currency, as returned.", "It will be labelled a demo/mock search, not live airline inventory.", "Wire it in lib/api.ts → searchMockFares()."] }] },
  "booking-windows": { title: "Booking Windows", sub: "config.py → BOOKING_WINDOWS_DAYS", status: "planned", notice: "Awaiting data. No endpoint returns fares by booking window.", controls: ["Route", "Booking window"], blocks: [{ h: "Configured offsets (days before departure)", items: ["3 days", "7 days", "14 days", "30 days"] }, { h: "Source field", items: ["fare_observations.booking_window_days (INTEGER, nullable; empty for DGCA bands)."] }] },
  sources: { title: "Data Sources", sub: "Three collection tiers", status: "static", notice: "Architecture and configuration only. The API exposes no collection status or counts.", steps: ["Source", "Collect", "Normalize", "Store", "Clean", "Index", "Analyze", "API", "Dashboard"], blocks: [
    { h: "Tier 0: DGCA tariff PDFs", items: ["collector_tier0_dgca.py, monthly.", "Tariff price bands (is_price_band = true), not live ticket prices.", "Source URLs are intentionally empty and need manual configuration."] },
    { h: "Tier 1: Google Flights", items: ["collector_tier1.py via fast-flights, no browser or API key.", "Designed for hourly runs; fare observations for configured routes and booking windows.", "Routes: DEL→BOM, BOM→BLR, DEL→BLR. Windows: 3, 7, 14, 30 days."] },
    { h: "Tier 2: Direct airline JSON endpoint", items: ["collector_tier2_airline.py via curl_cffi.", "SEARCH_ENDPOINT is blank by design; must be configured manually.", "Every request passes the robots.txt gate (robots_check.py)."] },
    { h: "Common record", items: ["storage.py normalises all tiers into one format, tagged tier0_dgca, tier1_google_flights or tier2_airline_direct."] }] },
  observations: { title: "Observations", sub: "fare_observations_clean", status: "planned", notice: "API endpoint not available. Rows are not exposed, so none are shown.", controls: ["Search", "Route", "Source tier", "Departure date", "Duplicate / outlier flag"], blocks: [{ h: "Fields in the schema", items: ["observed_at_utc, source_tier, source_detail", "origin, destination, departure_date, booking_window_days", "airline, fare_type, price, currency, is_price_band, raw_ref", "Clean table adds: is_duplicate, is_outlier, cleaned_at_utc"] }] },
  quality: { title: "Data Quality", sub: "cleaning.py", status: "static", notice: "Counts of flagged rows are not exposed by the API, so none are shown.", blocks: [
    { h: "Flagged, never deleted", items: ["Every raw row is copied to fare_observations_clean with flags, so a missing fare can always be explained by a query."] },
    { h: "Flagged duplicate", items: ["Same source tier, route, departure date, airline and observation hour. The first is kept; later ones are flagged."] },
    { h: "Flagged outlier", items: ["IQR rule (1.5×) per route and departure date. Groups under 4 prices, or null prices, are never flagged."] },
    { h: "Valid observation", items: ["Not a duplicate, not an outlier, price present. Only these feed the index and anomaly detection."] },
    { h: "Not implemented", items: ["Missing-cell interpolation is deliberately unimplemented; no values are estimated."] }] },
  anomalies: { title: "Anomalies", sub: "anomaly.py", status: "planned", notice: "Anomaly API not currently exposed. " + NOAPI, blocks: [
    { h: "Backend method", items: ["Rolling z-score per route over valid observations.", "Window 10, minimum 3 points, flagged when |z| > 2.5.", "Alerts are logged by the script; nothing is stored or served.", "--inject-test-anomaly adds one synthetic row in memory only, to demo the detector."] },
    { h: "To connect", items: ["Implement getAnomalies() in lib/api.ts once an endpoint exists."] }] },
  cpi: { title: "Airfare CPI", sub: "Economic analysis", status: "static", notice: "Live CPI-style values are not available. The repo computes only the route-level index.", blocks: [
    { h: "Official CPI", items: ["Published by government statistical agencies. This project does not produce or estimate it."] },
    { h: "Airfare index prototype", items: ["Route-level index of collected fares, 100 × current mean price ÷ base-period mean price.", "No national rollup, weighting, seasonal adjustment or forecast exists in the code."] },
    { h: "Intended use", items: ["To show how airfare observations could inform CPI-style analysis. Not an official statistic."] }] },
  methodology: { title: "Methodology", sub: "How the pipeline works", status: "static", notice: "Prototype. Not an official CPI or government index.", blocks: [
    { h: "1–2. Collection and normalisation", items: ["Tier 0/1/2 collectors write one common record format."] },
    { h: "3–5. Cleaning", items: ["Rows are flagged, not deleted: duplicates by hour bucket, outliers by IQR."] },
    { h: "6–7. Base period and index", items: ["Base = mean valid price on the earliest observation date for the route.", "Current = mean of all valid prices loaded in the run.", "Index = 100 × current ÷ base (fixed-basket Laspeyres-style, single item per route)."] },
    { h: "8. Anomaly detection", items: ["Rolling z-score (window 10, threshold 2.5), run separately."] },
    { h: "9–10. API and dashboard", items: ["Read-only FastAPI serves the latest index per route; this dashboard reads it."] },
    { h: "Limitations", items: ["Prototype; data depends on what collectors have run.", "DGCA data are price bands; Google Flights data are collected observations; direct airline data needs endpoint configuration.", "No index history is exposed, and re-running cleaning without --since can double-count rows.", "Not an official CPI statistic."] }] },
};
