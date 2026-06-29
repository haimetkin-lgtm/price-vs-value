"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { markReportPaid } from "@/lib/reports";

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const sessionId = params.get("session_id");
    const reportId = params.get("report_id");
    if (!sessionId || !reportId) { setStatus("error"); return; }

    markReportPaid(reportId, sessionId)
      .then(() => {
        setStatus("done");
        setTimeout(() => router.push(`/report/${reportId}`), 2000);
      })
      .catch(() => setStatus("error"));
  }, [params, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-sm px-4">
        {status === "loading" && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">מאמת תשלום...</h1>
            <p className="text-gray-500 text-sm">רגע אחד</p>
          </>
        )}
        {status === "done" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">התשלום אושר!</h1>
            <p className="text-gray-500 text-sm">מעביר אותך לדוח...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">משהו השתבש</h1>
            <p className="text-gray-500 text-sm mb-4">
              אם חויבת — פנה אלינו ונשלח את הדוח ידנית.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              חזור לדף הבית
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">טוען...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
