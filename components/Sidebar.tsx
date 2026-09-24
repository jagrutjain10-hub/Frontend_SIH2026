"use client";
import Link from "next/link"; import { usePathname } from "next/navigation"; import { useState } from "react";
const NAV: [string, [string, string, boolean][]][] = [
  ["Overview", [["Command Center", "/", true]]],
  ["Airfare intelligence", [["Airfare Index", "/airfare-index", true], ["Routes", "/routes", true], ["Fare Lookup", "/fare-lookup", false], ["Booking Windows", "/booking-windows", false]]],
  ["Data pipeline", [["Data Sources", "/sources", true], ["Observations", "/observations", false], ["Data Quality", "/quality", true]]],
  ["Analytics", [["Anomalies", "/anomalies", false], ["Airfare CPI", "/cpi", true]]],
  ["System", [["API Status", "/status", true], ["Methodology", "/methodology", true]]],
];
export default function Sidebar() {
  const p = usePathname(); const [o, setO] = useState(false);
  return (<>
    <div className="top"><b>AIRPRICE INDIA</b><button className="g" aria-expanded={o} onClick={() => setO(!o)}>Menu</button></div>
    <nav className={"side" + (o ? " open" : "")} aria-label="Main">
      <div className="brand">AIRPRICE INDIA<small>National Airfare Intelligence</small></div>
      {NAV.map(([g, items]) => (<div key={g}><div className="grp">{g}</div>{items.map(([l, h, live]) => (
        <Link key={h} href={h} onClick={() => setO(false)} className={"nav" + (p === h ? " on" : "")} aria-current={p === h ? "page" : undefined}>
          {l}<span className={"dot" + (live ? " live" : "")} title={live ? "Backed by the API or static documentation" : "Backend data not exposed"} /></Link>))}</div>))}
      <p className="grp s">Green dot: live or documented. Grey: backend data not exposed by the API.</p>
    </nav></>);
}
