"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/history` },
    });
    if (err) setError(err.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">כניסה לחשבון</h1>
          <p className="text-sm text-gray-500 mt-1">נשלח לך קישור כניסה למייל</p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">📬</div>
            <p className="text-gray-700 font-medium">בדוק את תיבת הדואר שלך</p>
            <p className="text-sm text-gray-500 mt-1">שלחנו קישור כניסה אל <strong>{email}</strong></p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">כתובת אימייל</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-left direction-ltr placeholder:text-right"
                dir="ltr"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold
                rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "שולח..." : "שלח קישור כניסה"}
            </button>

            <a href="/" className="text-center text-sm text-gray-400 hover:text-gray-600">
              חזרה לדף הבית
            </a>
          </form>
        )}
      </div>
    </main>
  );
}
