export type ReportTier = "standard" | "appraiser";

export const TIER_CONFIG: Record<ReportTier, { amount: number; label: string; paymentLink: string }> = {
  standard: {
    amount: 18,
    label: "ניתוח בסיסי",
    paymentLink: "https://secure.cardcom.solutions/EA/EA5/csAsSiJ08k21N1d70juHwQ",
  },
  appraiser: {
    amount: 49,
    label: "ניתוח מורחב",
    paymentLink: "https://secure.cardcom.solutions/EA/EA5/BR0mVlhwBkCTJVHIhgxvOA",
  },
};

export function redirectToStripePayment(tier: ReportTier, reportId: string) {
  const { paymentLink } = TIER_CONFIG[tier];

  if (!paymentLink) {
    window.location.href = `/report?id=${reportId}&demo=true`;
    return;
  }

  const url = new URL(paymentLink);
  url.searchParams.set("SuccessRedirectUrl", `${window.location.origin}/report?id=${reportId}`);
  url.searchParams.set("FailedRedirectUrl", `${window.location.origin}/?payment=failed`);
  window.location.href = url.toString();
}
