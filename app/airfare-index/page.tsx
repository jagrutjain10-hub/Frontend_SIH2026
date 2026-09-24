"use client";
import { getLatestIndex } from "@/lib/api"; import { useApi } from "@/lib/useApi";
import { Head, Card, Async, Notice, fmt } from "@/components/ui"; import { IndexBars } from "@/components/IndexBars";
export default function IndexPage() {
  const [ix, retry] = useApi(getLatestIndex);
  return (<>
    <Head t="Airfare Index" sub="Route-level prototype. Not an official CPI." />
    <Async st={ix} retry={retry} empty={{ when: d => d.length === 0, title: "No airfare index records available", text: "Run the cleaning and index calculation pipeline to populate this view." }}>{rows => (<>
      <div className="grid g2" style={{ marginBottom: 14 }}>
        <Card title="Route comparison"><IndexBars rows={rows} /></Card>
        <Card title="Index over time"><Notice>Not available. /index/latest returns only the newest value per route; no history endpoint exists.</Notice></Card></div>
      <Card title="Latest index by route"><div className="scroll"><table><thead><tr><th>Origin</th><th>Destination</th><th className="n">Index</th><th>Base period</th><th className="n">Observations</th><th>Computed (UTC)</th></tr></thead>
        <tbody>{rows.map(r => (<tr key={r.origin + r.destination}><td>{r.origin}</td><td>{r.destination}</td><td className="n"><b>{r.index_value.toFixed(2)}</b></td><td>{r.base_period}</td><td className="n">{r.n_observations}</td><td>{fmt(r.computed_at_utc)}</td></tr>))}</tbody></table></div></Card></>)}</Async>
    <Card title="How it is calculated"><p><b>Index = 100 × current mean price ÷ base-period mean price</b></p>
      <ul><li>Base period: the earliest date with valid cleaned data for the route.</li><li>Current: mean of all valid prices loaded in the run.</li><li>Valid means not flagged duplicate, not flagged outlier, price present.</li><li>100 means the same as the base period; it is not a month-on-month or year-on-year change.</li></ul></Card></>);
}
