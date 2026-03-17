/**
 * 重置所有「已列印」(invoiced) 的客戶狀態回「未列印」(up_to_date)
 *
 * 使用方式：
 *   node scripts/reset-payment-status.mjs
 *
 * 環境變數來源：讀取 .env.local 的 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
import { readFileSync } from "fs";
import https from "https";
import { resolve } from "path";

// ─── 讀取 .env.local ─────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf-8").split("\n");
  const env = {};
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

// ─── Supabase REST request ───────────────────────────────────────────────────
function supabaseRpc(fnName, args) {
  return new Promise((resolve, reject) => {
    const url = new URL(`/rest/v1/rpc/${fnName}`, SUPABASE_URL);
    const data = JSON.stringify(args);
    const req = https.request(url, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
      },
    }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString();
        try { resolve(JSON.parse(text)); } catch { resolve(text); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// ─── 執行重置 ────────────────────────────────────────────────────────────────
const result = await supabaseRpc("batch_update_payment_status", {
  p_customer_ids: Array.from({ length: 1000 }, (_, i) => i + 1),
  p_new_status: "up_to_date",
  p_update_billing: false,
});

if (result.error || result.message) {
  console.error("Error:", result.message || result.error);
} else {
  console.log(`Done! ${result.updated} 筆客戶已重置為 up_to_date`);
}
