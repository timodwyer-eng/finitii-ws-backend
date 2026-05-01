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
  { td: "BNB/USD", db: "BNB", type: "crypto" },
   { td: "DOGE/USD", db: "DOGE", type: "crypto" },
  { td: "ADA/USD",  db: "ADA",  type: "crypto" },
  { td: "AVAX/USD", db: "AVAX", type: "crypto" },
  { td: "LINK/USD", db: "LINK", type: "crypto" },
  { td: "DOT/USD",  db: "DOT",  type: "crypto" },
  { td: "LTC/USD",  db: "LTC",  type: "crypto" },
  { td: "TRX/USD",  db: "TRX",  type: "crypto" },
  { td: "NEAR/USD", db: "NEAR", type: "crypto" },
  { td: "APT/USD",  db: "APT",  type: "crypto" },
  { td: "OP/USD",   db: "OP",   type: "crypto" },
  { td: "ARB/USD",  db: "ARB",  type: "crypto" },
  { td: "ATOM/USD", db: "ATOM", type: "crypto" },
  { td: "ALGO/USD", db: "ALGO", type: "crypto" },
  { td: "ICP/USD",  db: "ICP",  type: "crypto" },
  { td: "SUI/USD",  db: "SUI",  type: "crypto" },
  { td: "MATIC/USD",db: "MATIC",type: "crypto" },
  { td: "UNI/USD",  db: "UNI",  type: "crypto" },
  { td: "FIL/USD",  db: "FIL",  type: "crypto" },
  { td: "HBAR/USD", db: "HBAR", type: "crypto" },
  { td: "VET/USD",  db: "VET",  type: "crypto" },
  { td: "INJ/USD",  db: "INJ",  type: "crypto" },
  { td: "SAND/USD", db: "SAND", type: "crypto" },
  { td: "MANA/USD", db: "MANA", type: "crypto" },
  { td: "AXS/USD",  db: "AXS",  type: "crypto" },
  { td: "FLOW/USD", db: "FLOW", type: "crypto" },
  { td: "EOS/USD",  db: "EOS",  type: "crypto" },
  { td: "XTZ/USD",  db: "XTZ",  type: "crypto" },
  { td: "AAVE/USD", db: "AAVE", type: "crypto" },
  { td: "MKR/USD",  db: "MKR",  type: "crypto" },
  { td: "SNX/USD",  db: "SNX",  type: "crypto" },
  { td: "COMP/USD", db: "COMP", type: "crypto" },
  { td: "CRV/USD",  db: "CRV",  type: "crypto" },
  { td: "FTM/USD",  db: "FTM",  type: "crypto" },
  { td: "TON/USD",  db: "TON",  type: "crypto" },
  { td: "SHIB/USD", db: "SHIB", type: "crypto" },
  { td: "PEPE/USD", db: "PEPE", type: "crypto" },
  { td: "WLD/USD",  db: "WLD",  type: "crypto" },
  { td: "SEI/USD",  db: "SEI",  type: "crypto" },
  { td: "TIA/USD",  db: "TIA",  type: "crypto" },
  { td: "RNDR/USD", db: "RNDR", type: "crypto" },
  { td: "FET/USD",  db: "FET",  type: "crypto" },
  { td: "GRT/USD",  db: "GRT",  type: "crypto" },
  { td: "LDO/USD",  db: "LDO",  type: "crypto" },
  { td: "RUNE/USD", db: "RUNE", type: "crypto" },
  { td: "STX/USD",  db: "STX",  type: "crypto" },

  { td: "XAU/USD",    db: "XAU/USD",    type: "commodity" },
  { td: "XAG/USD",    db: "XAG/USD",    type: "commodity" },
  { td: "WTI/USD",    db: "WTI/USD",    type: "commodity" },
  { td: "XPT/USD",    db: "XPT/USD",    type: "commodity" },
  { td: "XPD/USD",    db: "XPD/USD",    type: "commodity" },
  { td: "NGAS/USD",   db: "NGAS/USD",   type: "commodity" },
  { td: "COPPER/USD", db: "COPPER/USD", type: "commodity" },
  { td: "WHEAT/USD",  db: "WHEAT/USD",  type: "commodity" },
  { td: "CORN/USD",   db: "CORN/USD",   type: "commodity" },
  { td: "SOYBEAN/USD",db: "SOYBEAN/USD",type: "commodity" },
  { td: "SUGAR/USD",  db: "SUGAR/USD",  type: "commodity" },
  { td: "COFFEE/USD", db: "COFFEE/USD", type: "commodity" },
  { td: "COTTON/USD", db: "COTTON/USD", type: "commodity" },
  { td: "COCOA/USD",  db: "COCOA/USD",  type: "commodity" },
  { td: "OJ/USD",     db: "OJ/USD",     type: "commodity" },


  { td: "SPY", db: "SPY", type: "stock" },
  { td: "QQQ", db: "QQQ", type: "stock" },
  { td: "DIA", db: "DIA", type: "index" },

  { td: "EUR/USD", db: "EUR/USD", type: "forex" },
  { td: "GBP/USD", db: "GBP/USD", type: "forex" },
  { td: "USD/JPY", db: "USD/JPY", type: "forex" },
  { td: "USD/CHF", db: "USD/CHF", type: "forex" },
  { td: "AUD/USD", db: "AUD/USD", type: "forex" },
  { td: "USD/CAD", db: "USD/CAD", type: "forex" },
  { td: "NZD/USD", db: "NZD/USD", type: "forex" },
  { td: "EUR/GBP", db: "EUR/GBP", type: "forex" },
  { td: "EUR/JPY", db: "EUR/JPY", type: "forex" },
  { td: "GBP/JPY", db: "GBP/JPY", type: "forex" }

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
