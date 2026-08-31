export type ReportTier = "standard" | "appraiser";

// Display-only prices. The authoritative product/amount mapping lives in the
// create-checkout Edge Function and is persisted on payment_orders.
export const TIER_CONFIG: Record<ReportTier, { amount: number; label: string }> = {
  standard: {
    amount: 18,
    label: "ניתוח בסיסי",
  },
  appraiser: {
    amount: 49,
    label: "ניתוח מורחב",
  },
};
