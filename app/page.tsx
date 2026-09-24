"use client";
import { getHealth, getLatestIndex } from "@/lib/api"; import { useApi } from "@/lib/useApi";
import { Head, Card, Notice, Async, fmt } from "@/components/ui"; import { IndexBars } from "@/components/IndexBars";
export default function Overview() {
  const [h] = useApi(getHealth); const [ix, retry] = useApi(getLatestIndex);
  const status = h.s === "loading" || ix.s === "loading" ? "…" : h.s === "err" ? "OFFLINE" : ix.s === "err" ? "DEGRADED" : "LIVE";
  const rows = ix.s === "ok" ? ix.data : [];
  const kpi = (l: string, v: string, n?: string) => (<Card><div className="mu s">{l}</div><div className="k">{v}</div>{n && <div className="mu s">{n}</div>}</Card>);
  return (<>
    <Head t="Command Center" sub="Route-level airfare price index prototype based on collected fare observations." />
    <Notice>Not an official CPI. Values below come from the backend API; anything it does not expose is marked as unavailable.</Notice>
    <div className="grid g4" style={{ marginBottom: 14 }}>
      <Card><div className="mu s">API status</div><div className="k"><span className={"badge " + status}>{status}</span></div><div className="mu s">/health + /index/latest</div></Card>
      {kpi("Routes with an index", ix.s === "ok" ? String(rows.length) : "Not available", "Distinct routes in /index/latest")}
      {kpi("Observations in index", ix.s === "ok" && rows.length ? rows.reduce((a, r) => a + r.n_observations, 0).toLocaleString("en-IN") : "Not available", "Sum of n_observations per route")}
      {kpi("Latest computation", ix.s === "ok" && rows.length ? fmt(rows.map(r => r.computed_at_utc).sort().at(-1)!) : "Not available", "Most recent computed_at_utc")}
    </div>
    <div className="grid g2">
      <Card title="Latest index by route"><Async st={ix} retry={retry} empty={{ when: d => d.length === 0, title: "No airfare index records available", text: "Run the cleaning and index calculation pipeline to populate this view." }}>{d => <IndexBars rows={d} />}</Async></Card>
      <Card title="Data-source status"><p>Not available. The API exposes no collection status or per-source counts.</p><p className="mu s">Tier 0 DGCA bands · Tier 1 Google Flights · Tier 2 direct airline. See Data Sources for the architecture.</p></Card>
    </div></>);
}
