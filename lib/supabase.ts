import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// כשאין env vars (פיתוח מקומי) — יוצרים client דמה שלא קורס
const isConfigured = url.startsWith("http");

export const supabase = isConfigured
  ? createClient(url, key)
  : createClient("https://placeholder.supabase.co", "placeholder");

// טיפוסי מסד הנתונים
export interface ReportRow {
  id: string;
  user_id: string | null;
  created_at: string;
  tier: "standard" | "appraiser";
  city: string;
  rooms: number;
  market_price: number;
  paff: number;
  v_rent: number;
  v_cost: number;
  price_premium_pct: number;
  pir: number;
  hai: number;
  dsti: number;
  uch_annual: number;
  rent_annual: number;
  inputs_json: Record<string, unknown>;
  share_token: string;
  paid: boolean;
  stripe_session_id: string | null;
}
