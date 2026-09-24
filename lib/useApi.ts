"use client";
import { useEffect, useState } from "react";
import { ApiError } from "./api";
export type State<T> = { s: "loading" } | { s: "ok"; data: T; ms: number; at: Date } | { s: "err"; err: ApiError };
export function useApi<T>(fn: () => Promise<T>) {
  const [st, set] = useState<State<T>>({ s: "loading" }); const [n, setN] = useState(0);
  useEffect(() => {
    let live = true; const t0 = Date.now(); set({ s: "loading" });
    fn().then(data => live && set({ s: "ok", data, ms: Date.now() - t0, at: new Date() }))
      .catch(err => live && set({ s: "err", err: err instanceof ApiError ? err : new ApiError("offline", "The backend service could not be reached.") }));
    return () => { live = false; };
  }, [n]); // eslint-disable-line
  return [st, () => setN(x => x + 1)] as const;
}
