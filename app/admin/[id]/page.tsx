"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { type ReportRow } from "@/lib/supabase";

function fmt(n: number) {
  if (n >= 1_000_000) return "₪" + (n / 1_000_000).toFixed(2) + "M";
  return "₪" + new Intl.NumberFormat("he-IL").format(Math.round(n));
}

function fmtPct(n: number) {
  return (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
}

export default function AdminReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReport(); }, [id]);

  async function loadReport() {
    setLoading(true);
    const res = await fetch(`/api/admin/report/${id}`);
    const data = await res.json();
    setReport(data.report || null);
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">טוען...</div>;
  if (!report) return <div className="min-h-screen flex items-center justify-center text-red-500">דוח לא נמצא</div>;

  const status = report.price_premium_pct > 5 ? "יקר מהשווי"
    : report.price_premium_pct < -5 ? "זול מהשווי"
    : "תמחור הוגן";

  const statusColor = report.price_premium_pct > 5 ? "text-red-600"
    : report.price_premium_pct < -5 ? "text-green-600"
    : "text-amber-600";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-[#1a3a5c] text-white px-6 py-4 shadow">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-blue-200 text-sm hover:text-white">
              לוח ניהול
            </Link>
            <span className="text-blue-300 mx-2">›</span>
            <span className="font-bold">{report.city} · {report.rooms} חדרים</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            report.paid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
          }`}>
            {report.paid ? "שולם" : "חינמי"}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400">עיר</div>
            <div className="font-bold text-lg text-gray-800">{report.city}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">חדרים</div>
            <div className="font-bold text-lg text-gray-800">{report.rooms}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">מחיר שוק</div>
            <div className="font-bold text-lg text-gray-800">{fmt(report.market_price)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">הערכה</div>
            <div className={`font-bold text-lg ${statusColor}`}>{status}</div>
            <div className={`text-sm font-medium ${statusColor}`}>{fmtPct(report.price_premium_pct)}</div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4">נתוני הדוח</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-400">שכר דירה שנתי: </span><span className="font-medium">{fmt(report.rent_annual)}</span></div>
            <div><span className="text-gray-400">PIR: </span><span className="font-medium">{report.pir?.toFixed(1)}</span></div>
            <div><span className="text-gray-400">HAI: </span><span className="font-medium">{report.hai?.toFixed(1)}%</span></div>
            <div><span className="text-gray-400">DSTI: </span><span className="font-medium">{report.dsti?.toFixed(1)}%</span></div>
            <div><span className="text-gray-400">UCH שנתי: </span><span className="font-medium">{fmt(report.uch_annual)}</span></div>
            <div><span className="text-gray-400">חבילה: </span><span className="font-medium">{report.tier === "appraiser" ? "שמאי" : "סטנדרט"}</span></div>
            <div><span className="text-gray-400">תאריך: </span><span className="font-medium">{new Date(report.created_at).toLocaleDateString("he-IL")}</span></div>
            <div><span className="text-gray-400">Share token: </span><span className="font-mono text-xs text-gray-500">{report.share_token}</span></div>
          </div>
        </div>

        {/* Inputs JSON */}
        {report.inputs_json && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4">נתוני קלט</h2>
            <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-4 overflow-auto">
              {JSON.stringify(report.inputs_json, null, 2)}
            </pre>
          </div>
        )}

        {/* Link to report */}
        <div className="flex gap-3">
          <Link
            href={`/report?id=${report.id}`}
            target="_blank"
            className="bg-[#1a3a5c] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-900"
          >
            פתח דוח ללקוח
          </Link>
          <Link
            href={`/share?token=${report.share_token}`}
            target="_blank"
            className="border border-[#1a3a5c] text-[#1a3a5c] px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
          >
            קישור שיתוף
          </Link>
        </div>
      </main>
    </div>
  );
}
