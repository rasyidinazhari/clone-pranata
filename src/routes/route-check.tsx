import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { checkAllRoutes, type RouteCheckResult } from "@/server/routeCheck.functions";

export const Route = createFileRoute("/route-check")({
  head: () => ({
    meta: [
      { title: "Route Checker — PranataCalc" },
      { name: "description", content: "Cek status semua route untuk deteksi 404." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RouteCheckPage,
});

function RouteCheckPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ checkedAt: string; baseUrl: string; results: RouteCheckResult[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await checkAllRoutes();
      setData(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const allOk = data?.results.every((r) => r.ok);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <div className="text-xs font-mono text-muted-foreground tracking-wider">DIAGNOSTIK</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">Route Checker</h1>
        <p className="text-muted-foreground mt-2">
          Cek status HTTP semua route utama untuk mendeteksi 404 atau masalah deploy.
        </p>
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        {loading ? "Mengecek…" : data ? "Cek Ulang" : "Mulai Cek"}
      </button>

      {err && (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <b>Error:</b> {err}
        </div>
      )}

      {data && (
        <div className="mt-6">
          <div className={`rounded-xl p-4 mb-4 text-sm border ${allOk ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400" : "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400"}`}>
            <b>{allOk ? "✅ Semua route OK" : "⚠️ Ada route bermasalah"}</b>
            <div className="text-xs opacity-80 mt-1">
              Base: <code>{data.baseUrl}</code> · Dicek {new Date(data.checkedAt).toLocaleString("id-ID")}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Route</th>
                  <th className="text-left px-4 py-3">HTTP</th>
                  <th className="text-left px-4 py-3">Waktu</th>
                  <th className="text-left px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((r) => (
                  <tr key={r.path} className="border-t border-border">
                    <td className="px-4 py-3">
                      {r.ok ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">{r.path}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${r.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
                        {r.status || "ERR"}
                      </span>
                      {r.error && <div className="text-xs text-destructive mt-1">{r.error}</div>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{r.durationMs}ms</td>
                    <td className="px-4 py-3">
                      <Link to={r.path as "/"} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        Buka <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-6">
        Tip: Jalankan halaman ini di environment production (mis. Vercel) untuk memastikan semua route SSR berjalan.
      </p>
    </div>
  );
}
