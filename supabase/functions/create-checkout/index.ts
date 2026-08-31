import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, content-type" };
const CARDCOM_CREATE_URL = "https://secure.cardcom.solutions/Interface/LowProfile.aspx";
const env = (name: string) => { const v = Deno.env.get(name); if (!v) throw new Error(`Missing ${name}`); return v; };
const hex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
async function accessToken(orderId: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env("REPORT_TOKEN_SECRET")),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(orderId)));
}
async function sha256(value: string) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 100_000) {
      return new Response("Request too large", { status: 413, headers: cors });
    }
    const { report, idempotencyKey } = await request.json();
    if (JSON.stringify(report ?? {}).length > 100_000) {
      return new Response("Request too large", { status: 413, headers: cors });
    }
    if (!report || !crypto.randomUUID || typeof idempotencyKey !== "string"
      || !/^[0-9a-f-]{36}$/i.test(idempotencyKey)) return new Response("Invalid request", { status: 400, headers: cors });
    const tier = report.tier === "appraiser" ? "appraiser" : report.tier === "standard" ? "standard" : null;
    if (!tier || typeof report.email !== "string" || report.email.length > 254
      || !Number.isFinite(report.marketPrice) || report.marketPrice <= 0) {
      return new Response("Invalid report", { status: 400, headers: cors });
    }
    const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const { data: identity } = bearer ? await db.auth.getUser(bearer) : { data: { user: null } };
    const { data: existing } = await db.from("payment_orders").select("id,product_type,checkout_url")
      .eq("idempotency_key", idempotencyKey).maybeSingle();
    let orderId = existing?.id ?? crypto.randomUUID();
    if (existing && existing.product_type !== tier) return new Response("Idempotency conflict", { status: 409, headers: cors });
    if (existing?.checkout_url) return Response.json({ checkoutUrl: existing.checkout_url }, { headers: cors });
    let token = await accessToken(orderId);
    if (!existing) {
      const amountAgorot = tier === "appraiser" ? 4900 : 1800;
      const safeReport = { ...report, city: String(report.city ?? "").slice(0, 120),
        name: String(report.name ?? "").slice(0, 120), phone: String(report.phone ?? "").slice(0, 40) };
      const { data: effectiveOrderId, error: createError } = await db.rpc("create_payment_order", {
        p_order_id: orderId, p_idempotency_key: idempotencyKey, p_product_type: tier,
        p_amount_agorot: amountAgorot, p_user_id: identity.user?.id ?? null,
        p_report: safeReport, p_access_token_hash: await sha256(token),
      });
      if (createError) throw createError;
      if (typeof effectiveOrderId === "string" && effectiveOrderId !== orderId) {
        orderId = effectiveOrderId;
        token = await accessToken(orderId);
        const { data: effectiveOrder } = await db.from("payment_orders")
          .select("report_id").eq("id", orderId).single();
        if (!effectiveOrder?.report_id) throw new Error("Idempotent order lookup failed");
        const { error: tokenError } = await db.from("reports")
          .update({ access_token_hash: await sha256(token) }).eq("id", effectiveOrder.report_id);
        if (tokenError) throw tokenError;
      }
    }
    const { data: claimed, error: claimError } = await db.rpc("claim_payment_checkout", { p_order_id: orderId });
    if (claimError) throw claimError;
    if (!claimed) {
      const { data: pending } = await db.from("payment_orders").select("checkout_url").eq("id", orderId).single();
      if (pending?.checkout_url) return Response.json({ checkoutUrl: pending.checkout_url }, { headers: cors });
      return new Response("Checkout creation in progress", { status: 409, headers: cors });
    }

    const base = env("PUBLIC_SITE_URL").replace(/\/$/, "");
    const amountAgorot = tier === "appraiser" ? 4900 : 1800;
    const createBody = new URLSearchParams({
      Operation: "1", TerminalNumber: env("CARDCOM_TERMINAL_NUMBER"),
      UserName: env("CARDCOM_API_USERNAME"), SumToBill: (amountAgorot / 100).toFixed(2),
      CoinId: "1", Language: "he", ProductName: tier === "appraiser" ? "דוח מורחב" : "דוח סטנדרטי",
      APILevel: "10", Codepage: "65001", MaxNumOfPayments: "1", MinNumOfPayments: "1",
      SuccessRedirectUrl: `${base}/report/success?order_id=${orderId}&access_token=${token}`,
      ErrorRedirectUrl: `${base}/?payment=failed`,
      IndicatorUrl: `${env("SUPABASE_URL")}/functions/v1/cardcom-indicator`,
      ReturnValue: orderId, CardOwnerEmail: String(report.email), AutoRedirect: "false",
    });
    const cardcomResponse = await fetch(CARDCOM_CREATE_URL, {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: createBody, signal: AbortSignal.timeout(15_000),
    });
    if (!cardcomResponse.ok) throw new Error("Cardcom checkout creation failed");
    const created = new URLSearchParams(await cardcomResponse.text());
    const checkoutUrl = created.get("url") ?? created.get("Url");
    const lowProfileCode = created.get("LowProfileCode") ?? created.get("lowprofilecode");
    if (created.get("ResponseCode") !== "0" || !checkoutUrl || !lowProfileCode) {
      throw new Error("Cardcom rejected checkout creation");
    }
    const parsedCheckout = new URL(checkoutUrl);
    if (parsedCheckout.protocol !== "https:" || parsedCheckout.hostname !== "secure.cardcom.solutions") {
      throw new Error("Unexpected Cardcom checkout URL");
    }
    const { error: checkoutError } = await db.from("payment_orders").update({
      checkout_url: parsedCheckout.toString(), low_profile_code: lowProfileCode,
      checkout_claimed_at: null, updated_at: new Date().toISOString(),
    }).eq("id", orderId).is("checkout_url", null);
    if (checkoutError) throw checkoutError;
    return Response.json({ checkoutUrl: parsedCheckout.toString() }, { headers: cors });
  } catch (error) {
    console.error(error instanceof Error ? error.message : "checkout failure");
    return new Response("Checkout creation failed", { status: 500, headers: cors });
  }
});
