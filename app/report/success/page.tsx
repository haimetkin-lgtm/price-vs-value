"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("order_id");
  const accessToken = params.get("access_token");
  const [status, setStatus] = useState<"loading" | "done" | "error">(
    orderId && accessToken ? "loading" : "error"
  );

  useEffect(() => {
    if (!orderId || !accessToken) return;
    const verifiedAccessToken = accessToken;

    let cancelled = false;
    async function waitForVerification() {
      for (let attempt = 0; attempt < 10 && !cancelled; attempt += 1) {
        const { data } = await supabase.rpc("get_paid_report_by_token", { p_token: verifiedAccessToken });
        if (Array.isArray(data) && data.length === 1) {
          setStatus("done");
          setTimeout(() => router.push(`/report?access_token=${encodeURIComponent(verifiedAccessToken)}`), 1200);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      if (!cancelled) setStatus("error");
    }
    void waitForVerification();
    return () => { cancelled = true; };
  }, [accessToken, orderId, router]);

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
              אם חויבת, פנה אלינו ונשלח את הדוח ידנית.
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
