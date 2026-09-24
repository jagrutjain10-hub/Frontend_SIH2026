"use client";
import { getHealth, getLatestIndex, ENDPOINTS } from "@/lib/api"; import { useApi } from "@/lib/useApi";
import { Head, Card, Async } from "@/components/ui";
export default function Status() {
  const [h, rh] = useApi(getHealth); const [ix, ri] = useApi(getLatestIndex);
  const st = h.s === "loading" || ix.s === "loading" ? "…" : h.s === "err" ? "OFFLINE" : ix.s === "err" ? "DEGRADED" : "LIVE";
  return (<><Head t="API Status" sub="FastAPI read-only service" />
    <div className="grid g2" style={{ marginBottom: 14 }}>
      <Card title="Service"><span className={"badge " + st}>{st}</span>
        <p className="mu s">LIVE = /health and /index/latest both answered. DEGRADED = health ok, index query failed. /health does not verify PostgreSQL; a successful /index/latest shows the index query ran.</p>
        {h.s === "ok" && <p className="s">Health responded in {h.ms} ms at {h.at.toLocaleTimeString()}.</p>}
        {ix.s === "ok" && <p className="s">/index/latest responded in {ix.ms} ms.</p>}
        <button className="g" onClick={() => { rh(); ri(); }}>Recheck</button></Card>
      <Card title="Latest responses"><Async st={h} retry={rh}>{d => <pre>{JSON.stringify(d, null, 2)}</pre>}</Async>
        <Async st={ix} retry={ri}>{d => <pre>{JSON.stringify(d.slice(0, 3), null, 2)}</pre>}</Async></Card></div>
    <Card title="Endpoint availability"><div className="scroll"><table><thead><tr><th>Endpoint</th><th>State</th><th>Note</th></tr></thead><tbody>{ENDPOINTS.map(e => (<tr key={e.path}><td>{e.path}</td><td><span className={"badge " + (e.state === "live" ? "LIVE" : "")}>{e.state === "live" ? "Available" : "Not exposed"}</span></td><td>{e.note}</td></tr>))}</tbody></table></div></Card></>);
}
