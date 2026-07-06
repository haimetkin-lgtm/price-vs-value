import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { report_id } = await req.json();
    if (!report_id) throw new Error("report_id missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: report, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", report_id)
      .single();

    if (error || !report) throw new Error("report not found");
    if (!report.customer_email) throw new Error("no customer email");

    const reportUrl = `https://haimetkin-lgtm.github.io/price-vs-value/report?id=${report_id}`;

    const tierLabel = report.tier === "appraiser" ? "ניתוח מורחב" : "ניתוח בסיסי";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "price-vs-value <noreply@insure.co.il>",
        to: report.customer_email,
        subject: `הדוח שלך מוכן — ${report.city}, ${report.rooms} חדרים`,
        html: `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;direction:rtl;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="background:#1e3a5f;padding:24px 32px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:20px;">מחיר מול שווי</h1>
      <p style="color:#bdd7ee;margin:4px 0 0;font-size:13px;">ניתוח שווי פונדמנטלי לנדל"ן</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;color:#333;margin-top:0;">שלום${report.customer_name ? " " + report.customer_name : ""},</p>
      <p style="color:#555;line-height:1.7;">ה${tierLabel} עבור הנכס שבדקת מוכן לצפייה.</p>

      <div style="background:#f0f7ff;border:1px solid #1e3a5f;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 4px;font-weight:bold;color:#1e3a5f;">פרטי הנכס</p>
        <p style="margin:0;color:#444;font-size:14px;">${report.city} · ${report.rooms} חדרים · מחיר שוק: ₪${Number(report.market_price).toLocaleString("he-IL")}</p>
      </div>

      <div style="text-align:center;margin:28px 0;">
        <a href="${reportUrl}" style="background:#1e3a5f;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
          לצפייה בדוח המלא ←
        </a>
        <p style="font-size:12px;color:#888;margin-top:8px;">הקישור שמור — תוכל לחזור אליו בכל עת</p>
      </div>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="font-size:12px;color:#999;text-align:center;margin:0;">
        מבוסס על הספר <strong>בועת נדל"ן</strong> · חיים אטקין, שמאי מקרקעין<br>
        © ${new Date().getFullYear()} חיים אטקין · כל הזכויות שמורות
      </p>
    </div>
  </div>
</body>
</html>`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
