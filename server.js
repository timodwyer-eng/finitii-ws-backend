import WebSocket from "ws";
import { createClient } from "@supabase/supabase-js";

const WS_URL = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${process.env.TWELVEDATA_API_KEY}`;

this.ws = new WebSocket(WS_URL);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const symbols = [
  "BTC/USD",
  "ETH/USD",
  "SPY",
  "QQQ",
  "EUR/USD",
  "GBP/USD"
]; // <-- expand later

let ws;
let latestPrices = {};

function connect() {
  console.log("🔌 Connecting to TwelveData...");

  ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log("✅ WS OPEN");

    ws.send(
      JSON.stringify({
        action: "subscribe",
        params: {
          symbols: symbols.join(",")
        }
      })
    );

    console.log("📡 Subscribed:", symbols.length, "symbols");
  });

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.event === "price") {
        const price = Number(msg.price);
        if (!price) return;

        latestPrices[msg.symbol] = {
          symbol: msg.symbol,
          price,
          change_24h: Number(msg.day_change_percent || 0),
          previous_close: Number(msg.close || 0),
          updated_at: new Date().toISOString()
        };

        console.log("💰", msg.symbol, price);
      }
    } catch (e) {
      console.error("Parse error:", e.message);
    }
  });

  ws.on("close", () => {
    console.log("⚠️ WS CLOSED — reconnecting...");
    setTimeout(connect, 3000);
  });

  ws.on("error", (err) => {
    console.error("❌ WS ERROR:", err.message);
  });
}

async function flushToSupabase() {
  const rows = Object.values(latestPrices);
  if (rows.length === 0) return;

  console.log("📤 Writing", rows.length, "rows");

  const { error } = await supabase
    .from("market_data")
    .upsert(rows, { onConflict: "symbol" });

  if (error) {
    console.error("❌ Supabase error:", error.message);
  }
}

// Start everything
connect();
setInterval(flushToSupabase, 2000);
