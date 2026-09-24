"use client";
import { getLatestIndex } from "@/lib/api"; import { useApi } from "@/lib/useApi";
import { Head, Card, Async, fmt } from "@/components/ui";
const CONFIGURED = [["DEL", "BOM"], ["BOM", "BLR"], ["DEL", "BLR"]]; // config.py ROUTES
export default function Routes() {
  const [ix, retry] = useApi(getLatestIndex);
  return (<><Head t="Routes" sub="Routes configured in config.py, joined with the latest index where one exists." />
    <Async st={ix} retry={retry}>{rows => {
      const key = (o: string, d: string) => o + d;
      const extra = rows.filter(r => !CONFIGURED.some(([o, d]) => key(o, d) === key(r.origin, r.destination))).map(r => [r.origin, r.destination]);
      return (<div className="grid g4">{[...CONFIGURED, ...extra].map(([o, d]) => { const r = rows.find(x => x.origin === o && x.destination === d);
        return (<Card key={o + d}><h2>{o} → {d}</h2>{r ? (<><div className="k">{r.index_value.toFixed(2)}</div><div className="mu s">Base {r.base_period} · {r.n_observations} observations</div><div className="mu s">Computed {fmt(r.computed_at_utc)}</div></>) : (<><div className="k mu">Awaiting data</div><div className="mu s">Configured, but no index record yet.</div></>)}
          <p className="mu s">Sources and data period: not exposed by the API.</p></Card>); })}</div>); }}</Async></>);
}
