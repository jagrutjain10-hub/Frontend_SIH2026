import "./globals.css"; import Sidebar from "@/components/Sidebar";
export const metadata = { title: "AIRPRICE INDIA · National Airfare Intelligence" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><div className="shell"><Sidebar /><main className="main">{children}</main></div></body></html>);
}
