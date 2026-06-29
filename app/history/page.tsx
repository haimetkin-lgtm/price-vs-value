"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type ReportRow } from "@/lib/supabase";
import { getUserReports } from "@/lib/reports";

function fmt(n: number) {
  if (n >= 1_000_000) return "₪" + (n / 1_000_000).toFixed(2) + "M";
  return "₪" + new Intl.NumberFormat("he-IL").format(Math.round(n));
}
function fmtPct(n: number) {
  return (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
}

export default function HistoryPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth");
        return;
      }
      setUserEmail(data.user.email ?? null);
      getUserReports().then(rows => {
        setReports(rows);
        setLoading(false);
      });
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return <div className="text-center py-20 text-gray-400">טוען היסטוריה...</div>;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* כותרת */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">הדוחות שלי</h1>
            {userEmail && <p className="text-sm text-gray-400 mt-0.5">{userEmail}</p>}
          </div>
          <div className="flex gap-2">
            <a href="/"
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              דוח חדש
            </a>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600">
              יציאה
            </button>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-400 mb-4">עדיין אין דוחות</p>
            <a href="/"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold
                rounded-xl hover:bg-blue-700 transition-colors">
              צור דוח ראשון ←
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reports.map(r => {
              const status = r.price_premium_pct > 5 ? "overpriced"
                : r.price_premium_pct < -5 ? "underpriced" : "fair";
              const premiumColor = status === "overpriced" ? "text-red-600"
                : status === "underpriced" ? "text-green-600" : "text-amber-600";
              const dateStr = new Date(r.created_at).toLocaleDateString("he-IL", {
                year: "numeric", month: "short", day: "numeric"
              });

              return (
                <div key={r.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        {r.city || "—"} · {r.rooms > 0 ? r.rooms + " חדרים" : "—"}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${r.tier === "appraiser" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {r.tier === "appraiser" ? "שמאי" : "סטנדרטי"}
                      </span>
                      {!r.paid && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                          לא שולם
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5 flex gap-3 flex-wrap">
                      <span>{fmt(r.market_price)}</span>
                      <span className={`font-medium ${premiumColor}`}>{fmtPct(r.price_premium_pct)}</span>
                      <span className="text-gray-300">·</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {r.paid && (
                      <>
                        <a href={`/report/${r.id}`}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          צפה
                        </a>
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/share/${r.share_token}`)}
                          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                          🔗
                        </button>
                      </>
                    )}
                    {!r.paid && (
                      <a href={`/report/${r.id}`}
                        className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
                        השלם תשלום
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
