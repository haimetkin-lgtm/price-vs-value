import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VERIFY_URL = "https://secure.cardcom.solutions/Interface/BillGoldGetLowProfileIndicator.aspx";
const env = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};
const field = (params: URLSearchParams, name: string) =>
  [...params.entries()].find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1];
const hex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
async function accessToken(orderId: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env("REPORT_TOKEN_SECRET")),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(orderId)));
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const indicator = new URLSearchParams(await request.text());
    const code = field(indicator, "LowProfileCode");
    if (!code) return new Response("Invalid indicator", { status: 400 });

    const verificationQuery = new URLSearchParams({
        TerminalNumber: env("CARDCOM_TERMINAL_NUMBER"),
        UserName: env("CARDCOM_API_USERNAME"),
        LowProfileCode: code,
        codepage: "65001",
      });
    const verification = await fetch(`${VERIFY_URL}?${verificationQuery}`, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!verification.ok) throw new Error("Cardcom verification failed");
    const verified = new URLSearchParams(await verification.text());
    const orderId = field(verified, "ReturnValue");
    const amountAgorot = Number(field(verified, "ExtShvaParams.Sum36"));
    const dealNumber = field(verified, "InternalDealNumber");
    if (field(verified, "Operation") !== "1" || field(verified, "OperationResponse") !== "0"
      || field(verified, "DealResponse") !== "0" || field(verified, "TerminalNumber") !== env("CARDCOM_TERMINAL_NUMBER")
      || field(verified, "LowProfileCode") !== code || !orderId || field(verified, "CoinId") !== "1"
      || !dealNumber || !Number.isInteger(amountAgorot)) {
      return new Response("Payment not verified", { status: 400 });
    }

    const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
    const { data: matchingOrder } = await db.from("payment_orders").select("id")
      .eq("id", orderId).eq("low_profile_code", code).maybeSingle();
    if (!matchingOrder) return new Response("Order mismatch", { status: 400 });
    const { data: confirmed, error } = await db.rpc("confirm_cardcom_payment", {
      p_order_id: orderId, p_provider_reference: dealNumber, p_amount_agorot: amountAgorot,
    });
    if (error || confirmed !== true) return new Response("Order mismatch", { status: 400 });
    const { data: claimed } = await db.from("payment_orders").update({ email_sent_at: new Date().toISOString() })
      .eq("id", orderId).is("email_sent_at", null).select("report_id").maybeSingle();
    if (claimed?.report_id) {
      const emailResponse = await fetch(`${env("SUPABASE_URL")}/functions/v1/send-report-email`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${env("SUPABASE_SERVICE_ROLE_KEY")}`,
          "x-internal-secret": env("INTERNAL_FUNCTION_SECRET"),
        },
        body: JSON.stringify({ report_id: claimed.report_id, access_token: await accessToken(orderId) }),
      }).catch(() => null);
      if (!emailResponse?.ok) {
        await db.from("payment_orders").update({ email_sent_at: null }).eq("id", orderId);
      }
    }
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error instanceof Error ? error.message : "indicator failure");
    return new Response("Verification failed", { status: 500 });
  }
});
