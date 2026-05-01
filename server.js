import WebSocket from "ws";
import express from "express";
import { createClient } from "@supabase/supabase-js";

// =====================
// ENV
// =====================
const WS_URL = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${process.env.TWELVEDATA_API_KEY}`;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// =====================
// SYMBOL CONFIG
// =====================
const SYMBOLS = [
  { td: "BTC/USD", db: "BTC", type: "crypto" },
  { td: "ETH/USD", db: "ETH", type: "crypto" },
  { td: "SOL/USD", db: "SOL", type: "crypto" },
  { td: "XRP/USD", db: "XRP", type: "crypto" },

  { td: "SPY", db: "SPY", type: "stock" },
  { td: "QQQ", db: "QQQ", type: "stock" },

  { td: "EUR/USD", db: "EUR/USD", type: "forex" },
  { td: "GBP/USD", db: "GBP/USD", type: "forex" }
];

// Map for quick lookup
const symbolMap = new Map();
SYMBOLS.forEach(s => symbolMap.set(s.td, s));

// =====================
// WS CONNECTION
// =====================
let ws;

function connectWS() {
  console.log("🔌 Connecting to TwelveData...");

  ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log("✅ WS OPEN");

    const symbols = SYMBOLS.map(s => s.td).join(",");

    ws.send(JSON.stringify({
      action: "subscribe",
      params: { symbols }
    }));

    console.log("📡 Subscribed:", symbols);
  });

  ws.on("message", async (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.event !== "price") return;

      const rawSymbol = msg.symbol;

      // 🔥 FIX: symbol mapping
      let config = symbolMap.get(rawSymbol);

      if (!config && rawSymbol.endsWith("/USD")) {
        const stripped = rawSymbol.replace("/USD", "");
        config = SYMBOLS.find(s => s.db === stripped);
      }

      if (!config) {
        console.log("⚠️ Unknown symbol:", rawSymbol);
        return;
      }

      const price = Number(msg.price);
      if (!price) return;

      console.log(`💰 ${config.db} = ${price}`);

      // =====================
      // SUPABASE WRITE
      // =====================
      const { error } = await supabase
        .from("market_data")
        .upsert({
          symbol: config.db,
          price: price,
          asset_type: config.type,
          updated_at: new Date().toISOString()
        }, { onConflict: "symbol" });

      if (error) {
        console.error("❌ Supabase error:", error.message);
      } else {
        console.log("✅ DB updated:", config.db);
      }

    } catch (err) {
      console.error("❌ Parse error:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("⚠️ WS CLOSED — reconnecting...");
    setTimeout(connectWS, 5000);
  });

  ws.on("error", (err) => {
    console.error("❌ WS ERROR:", err.message);
  });
}

// Start WS
connectWS();

// =====================
// EXPRESS (RAILWAY)
// =====================
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Finitii WS backend running");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
