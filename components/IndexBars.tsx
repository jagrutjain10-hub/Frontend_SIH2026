import { IndexPoint } from "@/lib/api";
export function IndexBars({ rows }: { rows: IndexPoint[] }) {
  const max = Math.max(150, ...rows.map(r => r.index_value * 1.1));
  return (<div role="img" aria-label="Latest index value per route; marker shows base period = 100">
    {rows.map(r => (<div className="bar" key={r.origin + r.destination}><b>{r.origin} → {r.destination}</b>
      <div className="track" title={`${r.index_value.toFixed(2)} vs base 100`}><div className="fill" style={{ width: `${(r.index_value / max) * 100}%` }} /><div className="base" style={{ left: `${(100 / max) * 100}%` }} /></div>
      <span>{r.index_value.toFixed(1)}</span></div>))}
    <p className="mu s">Dark marker = base period (100). Bars show the latest computed value per route.</p></div>);
}
