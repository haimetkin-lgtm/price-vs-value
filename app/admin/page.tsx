"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  id: string;
  created_at: string;
  tier: "standard" | "appraiser";
  city: string;
  rooms: number;
  market_price: number;
  price_premium_pct: number;
  paid: boolean;
  user_id: string | null;
  share_token: string;
};

function fmt(n: number) {
  if (n >= 1_000_000) return "₪" + (n / 1_000_000).toFixed(2) + "M";
  return "₪" + new Intl.NumberFormat("he-IL").format(Math.round(n));
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadReports(); }, []);

  async function loadReports() {
    setLoading(true);
    const res = await fetch("/api/admin/reports");
    const data = await res.json();
    setReports(data.reports || []);
    setLoading(false);
  }

  const filtered = filter === "all" ? reports
    : filter === "paid" ? reports.filter((r) => r.paid)
    : reports.filter((r) => !r.paid);

  const paidCount = reports.filter((r) => r.paid).length;
  const standardRevenue = reports.filter((r) => r.paid && r.tier === "standard").length * 99;
  const appraiserRevenue = reports.filter((r) => r.paid && r.tier === "appraiser").length * 299;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-[#1a3a5c] text-white px-6 py-4 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">לוח ניהול — price-vs-value</h1>
            <p className="text-blue-200 text-sm">ממשק פנימי לניהול דוחות</p>
          </div>
          <Link href="/" className="text-blue-200 hover:text-white text-sm underline">
            חזרה לאתר
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-[#1a3a5c]">{reports.length}</div>
            <div className="text-gray-500 text-sm mt-1">סה"כ דוחות</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600">{paidCount}</div>
            <div className="text-gray-500 text-sm mt-1">דוחות ששולמו</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-500">{reports.length - paidCount}</div>
            <div className="text-gray-500 text-sm mt-1">דוחות חינמיים</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-emerald-600">₪{(standardRevenue + appraiserRevenue).toLocaleString()}</div>
            <div className="text-gray-500 text-sm mt-1">הכנסות</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "הכל" },
            { key: "paid", label: "שולמו" },
            { key: "free", label: "חינמיים" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={loadReports}
            className="mr-auto px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            רענן
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">טוען דוחות...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">אין דוחות להצגה</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">עיר</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">חדרים</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">מחיר שוק</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">פרמיה</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">חבילה</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">תשלום</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">תאריך</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.city}</td>
                    <td className="px-4 py-3 text-gray-600">{r.rooms}</td>
                    <td className="px-4 py-3 text-gray-700">{fmt(r.market_price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${r.price_premium_pct > 0 ? "text-red-600" : "text-green-600"}`}>
                        {r.price_premium_pct > 0 ? "+" : ""}{r.price_premium_pct?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.tier === "appraiser"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {r.tier === "appraiser" ? "שמאי" : "סטנדרט"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.paid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}>
                        {r.paid ? "שולם" : "חינמי"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(r.created_at).toLocaleDateString("he-IL")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/${r.id}`}
                        className="text-[#1a3a5c] hover:underline font-medium text-xs"
                      >
                        פתח דוח
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
