"use client";
import { ReactNode } from "react";
import { State } from "@/lib/useApi";
export const fmt = (s: string) => { const d = new Date(s); return isNaN(+d) ? s : d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); };
export const Head = ({ t, sub }: { t: string; sub: string }) => (<header><h1>{t}</h1><p className="sub">{sub}</p></header>);
export const Card = ({ title, children }: { title?: string; children: ReactNode }) => (<section className="card">{title && <h2>{title}</h2>}{children}</section>);
export const Notice = ({ children, err }: { children: ReactNode; err?: boolean }) => (<div className={"notice" + (err ? " err" : "")} role={err ? "alert" : "status"}>{children}</div>);
export const Skeleton = ({ rows = 4 }: { rows?: number }) => (<div aria-busy="true" aria-label="Loading">{Array.from({ length: rows }, (_, i) => <div key={i} className="sk" style={{ width: `${95 - i * 12}%` }} />)}</div>);
export function Async<T>({ st, retry, children, empty }: { st: State<T>; retry: () => void; children: (d: T) => ReactNode; empty?: { when: (d: T) => boolean; title: string; text: string } }) {
  if (st.s === "loading") return <Skeleton />;
  if (st.s === "err") {
    const t = { offline: "API OFFLINE", timeout: "API TIMEOUT", not_found: "ENDPOINT NOT FOUND", malformed: "UNEXPECTED RESPONSE", http: "API ERROR" }[st.err.kind];
    return <Notice err><b>{t}</b><div>{st.err.message}</div><p><button className="g" onClick={retry}>Retry</button></p></Notice>;
  }
  if (empty?.when(st.data)) return <Notice><b>{empty.title}</b><div>{empty.text}</div></Notice>;
  return <>{children(st.data)}</>;
}
