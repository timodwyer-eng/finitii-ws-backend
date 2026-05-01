import WebSocket from "ws";
import express from "express";
import { createClient } from "@supabase/supabase-js";

// ENV
const WS_URL = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${process.env.TWELVEDATA_API_KEY}`;

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Symbols (expand later)
const symbols = [
  "BTC/USD",
  "ETH/USD",
  "SPY",
  "QQQ",
  "EUR/USD",
  "GBP/USD"
];

let ws;
let latestPrices = {};

// Map symbols for DB consistency
function mapSymbol(tdSymbol) {
  if (tdSymbol === "BTC/USD") return "BTC";
  if (tdSymbol === "ETH/USD") return "ETH";
  return tdSymbol;
}

// CONNECT WS
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
        if (!price || !isFinite(price)) return;

        const dbSymbol = mapSymbol(msg.symbol);

        latestPrices[dbSymbol] = {
          symbol: dbSymbol,
          price,
          change_24h: Number(msg.day_change_percent || 0),
          previous_close: Number(msg.close || 0),
          updated_at: new Date().toISOString()
        };

        console.log("💰", dbSymbol, price);
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

// WRITE TO SUPABASE
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

// START WS
connect();
setInterval(flushToSupabase, 2000);

// EXPRESS SERVER (REQUIRED FOR RAILWAY)
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Finitii backend running");
});

app.get("/status", (req, res) => {
  res.json({
    connected: ws?.readyState === 1,
    trackedSymbols: Object.keys(latestPrices).length
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
