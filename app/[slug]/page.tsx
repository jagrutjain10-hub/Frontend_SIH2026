import { notFound } from "next/navigation"; import { MODULES } from "@/lib/modules"; import { Head, Card, Notice } from "@/components/ui";
export default function Module({ params }: { params: { slug: string } }) {
  const m = MODULES[params.slug]; if (!m) notFound();
  return (<><Head t={m.title} sub={m.sub} /><Notice><b>{m.status === "planned" ? "Planned module: " : ""}</b>{m.notice}</Notice>
    {m.steps && <div className="pipe" aria-label="Pipeline">{m.steps.map((s, i) => <span key={s}>{s}{i < m.steps!.length - 1 && <i> →</i>}</span>)}</div>}
    {m.controls && <Card title="Filters (disabled until data is available)"><div className="grid g4">{m.controls.map(c => <label key={c} className="s">{c}<input disabled placeholder="Unavailable" aria-label={c} /></label>)}</div></Card>}
    <div className="grid g2" style={{ marginTop: 14 }}>{m.blocks.map(b => <Card key={b.h} title={b.h}><ul>{b.items.map(i => <li key={i}>{i}</li>)}</ul></Card>)}</div></>);
}
export function generateStaticParams() { return Object.keys(MODULES).map(slug => ({ slug })); }
