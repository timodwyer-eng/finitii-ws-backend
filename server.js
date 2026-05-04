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
  { td: "IWM",  db: "IWM",  type: "etf" },
  { td: "VTI",  db: "VTI",  type: "etf" },
  { td: "GLD",  db: "GLD",  type: "etf" },
  { td: "SLV",  db: "SLV",  type: "etf" },
  { td: "TLT",  db: "TLT",  type: "etf" },
  { td: "HYG",  db: "HYG",  type: "etf" },
  { td: "EEM",  db: "EEM",  type: "etf" },

  { td: "EUR/USD", db: "EUR/USD", type: "forex" },
  { td: "GBP/USD", db: "GBP/USD", type: "forex" },
  { td: "USD/JPY", db: "USD/JPY", type: "forex" },
  { td: "USD/CHF", db: "USD/CHF", type: "forex" },
  { td: "AUD/USD", db: "AUD/USD", type: "forex" },
  { td: "USD/CAD", db: "USD/CAD", type: "forex" },
  { td: "NZD/USD", db: "NZD/USD", type: "forex" },
  { td: "EUR/GBP", db: "EUR/GBP", type: "forex" },
  { td: "EUR/JPY", db: "EUR/JPY", type: "forex" },
  { td: "GBP/JPY", db: "GBP/JPY", type: "forex" },
  { td: "EUR/CHF", db: "EUR/CHF", type: "forex" },
  { td: "EUR/AUD", db: "EUR/AUD", type: "forex" },
  { td: "EUR/CAD", db: "EUR/CAD", type: "forex" },
  { td: "EUR/NZD", db: "EUR/NZD", type: "forex" },
  { td: "EUR/NOK", db: "EUR/NOK", type: "forex" },
  { td: "EUR/SEK", db: "EUR/SEK", type: "forex" },
  { td: "EUR/PLN", db: "EUR/PLN", type: "forex" },
  { td: "EUR/TRY", db: "EUR/TRY", type: "forex" },
  { td: "EUR/HUF", db: "EUR/HUF", type: "forex" },
   { td: "GBP/CHF", db: "GBP/CHF", type: "forex" },
  { td: "GBP/AUD", db: "GBP/AUD", type: "forex" },
  { td: "GBP/CAD", db: "GBP/CAD", type: "forex" },
  { td: "GBP/NZD", db: "GBP/NZD", type: "forex" },
  { td: "GBP/SEK", db: "GBP/SEK", type: "forex" },
  { td: "GBP/NOK", db: "GBP/NOK", type: "forex" },
  // AUD crosses
  { td: "AUD/JPY", db: "AUD/JPY", type: "forex" },
  { td: "AUD/CHF", db: "AUD/CHF", type: "forex" },
  { td: "AUD/CAD", db: "AUD/CAD", type: "forex" },
  { td: "AUD/NZD", db: "AUD/NZD", type: "forex" },
  // CAD / CHF / NZD crosses
  { td: "CAD/JPY", db: "CAD/JPY", type: "forex" },
  { td: "CAD/CHF", db: "CAD/CHF", type: "forex" },
  { td: "CHF/JPY", db: "CHF/JPY", type: "forex" },
  { td: "NZD/JPY", db: "NZD/JPY", type: "forex" },
  { td: "NZD/CHF", db: "NZD/CHF", type: "forex" },
  { td: "NZD/CAD", db: "NZD/CAD", type: "forex" },
  // USD exotics
  { td: "USD/MXN", db: "USD/MXN", type: "forex" },
  { td: "USD/ZAR", db: "USD/ZAR", type: "forex" },
  { td: "USD/TRY", db: "USD/TRY", type: "forex" },
  { td: "USD/HKD", db: "USD/HKD", type: "forex" },
  { td: "USD/SGD", db: "USD/SGD", type: "forex" },
  { td: "USD/NOK", db: "USD/NOK", type: "forex" },
  { td: "USD/SEK", db: "USD/SEK", type: "forex" },
  { td: "USD/DKK", db: "USD/DKK", type: "forex" },
  { td: "USD/PLN", db: "USD/PLN", type: "forex" },
  { td: "USD/CNH", db: "USD/CNH", type: "forex" },
  { td: "USD/HUF", db: "USD/HUF", type: "forex" },
  { td: "USD/CZK", db: "USD/CZK", type: "forex" },
  { td: "USD/BRL", db: "USD/BRL", type: "forex" },

  { td: "AAPL",  db: "AAPL",  type: "stock" },
  { td: "MSFT",  db: "MSFT",  type: "stock" },
  { td: "NVDA",  db: "NVDA",  type: "stock" },
  { td: "AMZN",  db: "AMZN",  type: "stock" },
  { td: "GOOGL", db: "GOOGL", type: "stock" },
  { td: "GOOG",  db: "GOOG",  type: "stock" },
  { td: "META",  db: "META",  type: "stock" },
  { td: "TSLA",  db: "TSLA",  type: "stock" },
  { td: "AVGO",  db: "AVGO",  type: "stock" },
  { td: "ORCL",  db: "ORCL",  type: "stock" },
  { td: "ADBE",  db: "ADBE",  type: "stock" },
  { td: "CSCO",  db: "CSCO",  type: "stock" },
  { td: "CRM",   db: "CRM",   type: "stock" },
  { td: "INTU",  db: "INTU",  type: "stock" },
  { td: "NOW",   db: "NOW",   type: "stock" },
  { td: "IBM",   db: "IBM",   type: "stock" },

  { td: "AMD",   db: "AMD",   type: "stock" },
  { td: "INTC",  db: "INTC",  type: "stock" },
  { td: "QCOM",  db: "QCOM",  type: "stock" },
  { td: "TXN",   db: "TXN",   type: "stock" },
  { td: "AMAT",  db: "AMAT",  type: "stock" },
  { td: "LRCX",  db: "LRCX",  type: "stock" },
  { td: "KLAC",  db: "KLAC",  type: "stock" },
  { td: "MRVL",  db: "MRVL",  type: "stock" },
  { td: "ADI",   db: "ADI",   type: "stock" },
  { td: "MCHP",  db: "MCHP",  type: "stock" },
  { td: "NXPI",  db: "NXPI",  type: "stock" },
  { td: "MU",    db: "MU",    type: "stock" },
  { td: "SNPS",  db: "SNPS",  type: "stock" },
  { td: "CDNS",  db: "CDNS",  type: "stock" },
  { td: "ENTG",  db: "ENTG",  type: "stock" },
  { td: "ONTO",  db: "ONTO",  type: "stock" },
  { td: "MKSI",  db: "MKSI",  type: "stock" },
  { td: "TER",   db: "TER",   type: "stock" },

  { td: "HUBS",  db: "HUBS",  type: "stock" },
  { td: "VEEV",  db: "VEEV",  type: "stock" },
  { td: "WDAY",  db: "WDAY",  type: "stock" },
  { td: "TEAM",  db: "TEAM",  type: "stock" },
  { td: "ZM",    db: "ZM",    type: "stock" },
  { td: "DOCU",  db: "DOCU",  type: "stock" },
  { td: "BOX",   db: "BOX",   type: "stock" },
  { td: "TWLO",  db: "TWLO",  type: "stock" },
  { td: "MDB",   db: "MDB",   type: "stock" },
  { td: "GTLB",  db: "GTLB",  type: "stock" },
  { td: "ESTC",  db: "ESTC",  type: "stock" },
  { td: "CFLT",  db: "CFLT",  type: "stock" },
  { td: "PTC",   db: "PTC",   type: "stock" },
  { td: "AZPN",  db: "AZPN",  type: "stock" },
  { td: "ANSS",  db: "ANSS",  type: "stock" },

   { td: "PANW",  db: "PANW",  type: "stock" },
  { td: "CRWD",  db: "CRWD",  type: "stock" },
  { td: "FTNT",  db: "FTNT",  type: "stock" },
  { td: "ZS",    db: "ZS",    type: "stock" },
  { td: "OKTA",  db: "OKTA",  type: "stock" },
  { td: "S",     db: "S",     type: "stock" },
  { td: "CYBR",  db: "CYBR",  type: "stock" },

  { td: "NET",   db: "NET",   type: "stock" },
  { td: "DDOG",  db: "DDOG",  type: "stock" },
  { td: "SNOW",  db: "SNOW",  type: "stock" },
  { td: "PLTR",  db: "PLTR",  type: "stock" },
  { td: "PATH",  db: "PATH",  type: "stock" },
  { td: "AI",    db: "AI",    type: "stock" },
  { td: "DOCN",  db: "DOCN",  type: "stock" },

   { td: "TTD",   db: "TTD",   type: "stock" },
  { td: "APP",   db: "APP",   type: "stock" },
  { td: "PINS",  db: "PINS",  type: "stock" },
  { td: "SNAP",  db: "SNAP",  type: "stock" },
  { td: "RBLX",  db: "RBLX",  type: "stock" },

  { td: "V",     db: "V",     type: "stock" },
  { td: "MA",    db: "MA",    type: "stock" },
  { td: "AXP",   db: "AXP",   type: "stock" },
  { td: "PYPL",  db: "PYPL",  type: "stock" },
  { td: "SQ",    db: "SQ",    type: "stock" },
  { td: "FIS",   db: "FIS",   type: "stock" },
  { td: "FISV",  db: "FISV",  type: "stock" },
  { td: "GPN",   db: "GPN",   type: "stock" },
  { td: "COIN",  db: "COIN",  type: "stock" },
  { td: "HOOD",  db: "HOOD",  type: "stock" },
  { td: "SOFI",  db: "SOFI",  type: "stock" },
  { td: "AFRM",  db: "AFRM",  type: "stock" },
  { td: "UPST",  db: "UPST",  type: "stock" },
  { td: "ADP",   db: "ADP",   type: "stock" },
  { td: "PAYX",  db: "PAYX",  type: "stock" },
  { td: "ICE",   db: "ICE",   type: "stock" },
  { td: "CME",   db: "CME",   type: "stock" },

   { td: "UBER",  db: "UBER",  type: "stock" },
  { td: "LYFT",  db: "LYFT",  type: "stock" },
  { td: "ABNB",  db: "ABNB",  type: "stock" },
  { td: "DASH",  db: "DASH",  type: "stock" },
  { td: "BKNG",  db: "BKNG",  type: "stock" },
  { td: "EXPE",  db: "EXPE",  type: "stock" },

  { td: "RIVN",  db: "RIVN",  type: "stock" },
  { td: "LCID",  db: "LCID",  type: "stock" },
  { td: "NIO",   db: "NIO",   type: "stock" },
  { td: "XPEV",  db: "XPEV",  type: "stock" },
  { td: "LI",    db: "LI",    type: "stock" },
  { td: "F",     db: "F",     type: "stock" },
  { td: "GM",    db: "GM",    type: "stock" },

  { td: "CTSH",  db: "CTSH",  type: "stock" },
  { td: "EPAM",  db: "EPAM",  type: "stock" },
  { td: "INFY",  db: "INFY",  type: "stock" },
  { td: "WIT",   db: "WIT",   type: "stock" },
  { td: "SAIC",  db: "SAIC",  type: "stock" },
  { td: "LDOS",  db: "LDOS",  type: "stock" },
  { td: "BAH",   db: "BAH",   type: "stock" },
  { td: "CACI",  db: "CACI",  type: "stock" },
  { td: "KEYS",  db: "KEYS",  type: "stock" },
  { td: "HPE",   db: "HPE",   type: "stock" },
  { td: "HPQ",   db: "HPQ",   type: "stock" },
  { td: "DELL",  db: "DELL",  type: "stock" },
  { td: "WDC",   db: "WDC",   type: "stock" },
  { td: "STX",   db: "STX",   type: "stock" },
  { td: "NTAP",  db: "NTAP",  type: "stock" },

  // Healthcare — Large Cap
  { td: "JNJ",   db: "JNJ",   type: "stock" },
  { td: "UNH",   db: "UNH",   type: "stock" },
  { td: "LLY",   db: "LLY",   type: "stock" },
  { td: "ABBV",  db: "ABBV",  type: "stock" },
  { td: "MRK",   db: "MRK",   type: "stock" },
  { td: "TMO",   db: "TMO",   type: "stock" },
  { td: "DHR",   db: "DHR",   type: "stock" },
  { td: "BSX",   db: "BSX",   type: "stock" },
  { td: "ABT",   db: "ABT",   type: "stock" },
  { td: "ISRG",  db: "ISRG",  type: "stock" },
  { td: "SYK",   db: "SYK",   type: "stock" },
  { td: "ELV",   db: "ELV",   type: "stock" },
  { td: "PFE",   db: "PFE",   type: "stock" },
  { td: "GILD",  db: "GILD",  type: "stock" },
  { td: "VRTX",  db: "VRTX",  type: "stock" },
  { td: "REGN",  db: "REGN",  type: "stock" },
  { td: "AMGN",  db: "AMGN",  type: "stock" },
  { td: "CI",    db: "CI",    type: "stock" },
  { td: "HUM",   db: "HUM",   type: "stock" },
  { td: "MDT",   db: "MDT",   type: "stock" },
  { td: "BDX",   db: "BDX",   type: "stock" },
  { td: "IQV",   db: "IQV",   type: "stock" },
  { td: "IDXX",  db: "IDXX",  type: "stock" },
  { td: "RMD",   db: "RMD",   type: "stock" },
  { td: "EW",    db: "EW",    type: "stock" },
  { td: "DXCM",  db: "DXCM",  type: "stock" },
  { td: "ZTS",   db: "ZTS",   type: "stock" },
  { td: "BIIB",  db: "BIIB",  type: "stock" },
  { td: "MRNA",  db: "MRNA",  type: "stock" },
  { td: "BNTX",  db: "BNTX",  type: "stock" },
  { td: "GEHC",  db: "GEHC",  type: "stock" },
  { td: "HCA",   db: "HCA",   type: "stock" },
  { td: "MCK",   db: "MCK",   type: "stock" },
  { td: "CVS",   db: "CVS",   type: "stock" },
  { td: "WBA",   db: "WBA",   type: "stock" },
  { td: "MOH",   db: "MOH",   type: "stock" },
  { td: "CNC",   db: "CNC",   type: "stock" },
  { td: "PODD",  db: "PODD",  type: "stock" },

  // Financials — Banks
  { td: "JPM",   db: "JPM",   type: "stock" },
  { td: "BAC",   db: "BAC",   type: "stock" },
  { td: "WFC",   db: "WFC",   type: "stock" },
  { td: "GS",    db: "GS",    type: "stock" },
  { td: "MS",    db: "MS",    type: "stock" },
  { td: "USB",   db: "USB",   type: "stock" },
  { td: "PNC",   db: "PNC",   type: "stock" },
  { td: "TFC",   db: "TFC",   type: "stock" },
  { td: "SCHW",  db: "SCHW",  type: "stock" },
  { td: "COF",   db: "COF",   type: "stock" },
  { td: "DFS",   db: "DFS",   type: "stock" },
  { td: "SYF",   db: "SYF",   type: "stock" },
  { td: "FITB",  db: "FITB",  type: "stock" },
  { td: "HBAN",  db: "HBAN",  type: "stock" },
  { td: "KEY",   db: "KEY",   type: "stock" },
  { td: "RF",    db: "RF",    type: "stock" },
  { td: "MTB",   db: "MTB",   type: "stock" },
  { td: "CFG",   db: "CFG",   type: "stock" },

  // Asset Managers / Exchanges
  { td: "BLK",   db: "BLK",   type: "stock" },
  { td: "BX",    db: "BX",    type: "stock" },
  { td: "KKR",   db: "KKR",   type: "stock" },
  { td: "APO",   db: "APO",   type: "stock" },
  { td: "ARES",  db: "ARES",  type: "stock" },
  { td: "SPGI",  db: "SPGI",  type: "stock" },
  { td: "MCO",   db: "MCO",   type: "stock" },
  { td: "MSI",   db: "MSI",   type: "stock" },

  // Insurance
  { td: "AIG",   db: "AIG",   type: "stock" },
  { td: "MET",   db: "MET",   type: "stock" },
  { td: "PRU",   db: "PRU",   type: "stock" },
  { td: "AFL",   db: "AFL",   type: "stock" },
  { td: "AJG",   db: "AJG",   type: "stock" },
  { td: "AON",   db: "AON",   type: "stock" },
  { td: "MMC",   db: "MMC",   type: "stock" },
  { td: "CB",    db: "CB",    type: "stock" },
  { td: "TRV",   db: "TRV",   type: "stock" },
  { td: "PGR",   db: "PGR",   type: "stock" },
  { td: "ALL",   db: "ALL",   type: "stock" },
  { td: "WRB",   db: "WRB",   type: "stock" },

  // Consumer — Retail
  { td: "WMT",   db: "WMT",   type: "stock" },
  { td: "COST",  db: "COST",  type: "stock" },
  { td: "TGT",   db: "TGT",   type: "stock" },
  { td: "HD",    db: "HD",    type: "stock" },
  { td: "LOW",   db: "LOW",   type: "stock" },
  { td: "TJX",   db: "TJX",   type: "stock" },
  { td: "ROST",  db: "ROST",  type: "stock" },
  { td: "BURL",  db: "BURL",  type: "stock" },
  { td: "DKS",   db: "DKS",   type: "stock" },
  { td: "RH",    db: "RH",    type: "stock" },
  { td: "LULU",  db: "LULU",  type: "stock" },
  { td: "NKE",   db: "NKE",   type: "stock" },
  { td: "ONON",  db: "ONON",  type: "stock" },
  { td: "SKX",   db: "SKX",   type: "stock" },

  // Consumer — Food & Beverage
  { td: "PEP",   db: "PEP",   type: "stock" },
  { td: "KO",    db: "KO",    type: "stock" },
  { td: "MDLZ",  db: "MDLZ",  type: "stock" },
  { td: "GIS",   db: "GIS",   type: "stock" },
  { td: "KHC",   db: "KHC",   type: "stock" },
  { td: "CAG",   db: "CAG",   type: "stock" },
  { td: "CPB",   db: "CPB",   type: "stock" },
  { td: "SJM",   db: "SJM",   type: "stock" },
  { td: "STZ",   db: "STZ",   type: "stock" },
  { td: "TAP",   db: "TAP",   type: "stock" },

  // Consumer — Restaurants
  { td: "MCD",   db: "MCD",   type: "stock" },
  { td: "SBUX",  db: "SBUX",  type: "stock" },
  { td: "CMG",   db: "CMG",   type: "stock" },
  { td: "YUM",   db: "YUM",   type: "stock" },
  { td: "DPZ",   db: "DPZ",   type: "stock" },
  { td: "QSR",   db: "QSR",   type: "stock" },
  { td: "DRI",   db: "DRI",   type: "stock" },
  { td: "TXRH",  db: "TXRH",  type: "stock" },
  { td: "WING",  db: "WING",  type: "stock" },
  { td: "SHAK",  db: "SHAK",  type: "stock" },

  // Consumer Staples / Personal Care
  { td: "PG",    db: "PG",    type: "stock" },
  { td: "CL",    db: "CL",    type: "stock" },
  { td: "KMB",   db: "KMB",   type: "stock" },
  { td: "CHD",   db: "CHD",   type: "stock" },
  { td: "CLX",   db: "CLX",   type: "stock" },
  { td: "MO",    db: "MO",    type: "stock" },
  { td: "PM",    db: "PM",    type: "stock" },
  { td: "BTI",   db: "BTI",   type: "stock" },

  // Energy — Oil & Gas
  { td: "XOM",   db: "XOM",   type: "stock" },
  { td: "CVX",   db: "CVX",   type: "stock" },
  { td: "COP",   db: "COP",   type: "stock" },
  { td: "EOG",   db: "EOG",   type: "stock" },
  { td: "PSX",   db: "PSX",   type: "stock" },
  { td: "VLO",   db: "VLO",   type: "stock" },
  { td: "MPC",   db: "MPC",   type: "stock" },
  { td: "OXY",   db: "OXY",   type: "stock" },
  { td: "DVN",   db: "DVN",   type: "stock" },
  { td: "FANG",  db: "FANG",  type: "stock" },
  { td: "MTDR",  db: "MTDR",  type: "stock" },
  { td: "SM",    db: "SM",    type: "stock" },
  { td: "CPE",   db: "CPE",   type: "stock" },
  { td: "SWN",   db: "SWN",   type: "stock" },
  { td: "AR",    db: "AR",    type: "stock" },
  { td: "EQT",   db: "EQT",   type: "stock" },
  { td: "RRC",   db: "RRC",   type: "stock" },

  // Energy — Services
  { td: "HAL",   db: "HAL",   type: "stock" },
  { td: "SLB",   db: "SLB",   type: "stock" },
  { td: "BKR",   db: "BKR",   type: "stock" },
  { td: "NOV",   db: "NOV",   type: "stock" },
  { td: "HP",    db: "HP",    type: "stock" },
  { td: "WHD",   db: "WHD",   type: "stock" },

  // Industrials — Aerospace & Defense
  { td: "LMT",   db: "LMT",   type: "stock" },
  { td: "NOC",   db: "NOC",   type: "stock" },
  { td: "GD",    db: "GD",    type: "stock" },
  { td: "RTX",   db: "RTX",   type: "stock" },
  { td: "BA",    db: "BA",    type: "stock" },
  { td: "LHX",   db: "LHX",   type: "stock" },
  { td: "TDG",   db: "TDG",   type: "stock" },
  { td: "HWM",   db: "HWM",   type: "stock" },
  { td: "TXT",   db: "TXT",   type: "stock" },

  // Industrials — Diversified
  { td: "GE",    db: "GE",    type: "stock" },
  { td: "HON",   db: "HON",   type: "stock" },
  { td: "EMR",   db: "EMR",   type: "stock" },
  { td: "ROK",   db: "ROK",   type: "stock" },
  { td: "ITW",   db: "ITW",   type: "stock" },
  { td: "PH",    db: "PH",    type: "stock" },
  { td: "AME",   db: "AME",   type: "stock" },
  { td: "GNRC",  db: "GNRC",  type: "stock" },
  { td: "CARR",  db: "CARR",  type: "stock" },
  { td: "OTIS",  db: "OTIS",  type: "stock" },
  { td: "ETN",   db: "ETN",   type: "stock" },
  { td: "CMI",   db: "CMI",   type: "stock" },
  { td: "IR",    db: "IR",    type: "stock" },

  // Industrials — Construction & Machinery
  { td: "CAT",   db: "CAT",   type: "stock" },
  { td: "DE",    db: "DE",    type: "stock" },
  { td: "AGCO",  db: "AGCO",  type: "stock" },
  { td: "PCAR",  db: "PCAR",  type: "stock" },
  { td: "URI",   db: "URI",   type: "stock" },
  { td: "TEX",   db: "TEX",   type: "stock" },
  { td: "MLM",   db: "MLM",   type: "stock" },
  { td: "VMC",   db: "VMC",   type: "stock" },

  // Industrials — Transportation
  { td: "UNP",   db: "UNP",   type: "stock" },
  { td: "NSC",   db: "NSC",   type: "stock" },
  { td: "CSX",   db: "CSX",   type: "stock" },
  { td: "FDX",   db: "FDX",   type: "stock" },
  { td: "UPS",   db: "UPS",   type: "stock" },

  // Industrials — Waste & Services
  { td: "WM",    db: "WM",    type: "stock" },
  { td: "RSG",   db: "RSG",   type: "stock" },
  { td: "CTAS",  db: "CTAS",  type: "stock" },
  { td: "FAST",  db: "FAST",  type: "stock" },
  { td: "GWW",   db: "GWW",   type: "stock" },
  { td: "MAS",   db: "MAS",   type: "stock" },
  { td: "ALLE",  db: "ALLE",  type: "stock" },

  // Materials
  { td: "LIN",   db: "LIN",   type: "stock" },
  { td: "APD",   db: "APD",   type: "stock" },
  { td: "SHW",   db: "SHW",   type: "stock" },
  { td: "PPG",   db: "PPG",   type: "stock" },
  { td: "ECL",   db: "ECL",   type: "stock" },
  { td: "NEM",   db: "NEM",   type: "stock" },
  { td: "GOLD",  db: "GOLD",  type: "stock" },
  { td: "AEM",   db: "AEM",   type: "stock" },
  { td: "WPM",   db: "WPM",   type: "stock" },
  { td: "FCX",   db: "FCX",   type: "stock" },
  { td: "AA",    db: "AA",    type: "stock" },
  { td: "NUE",   db: "NUE",   type: "stock" },
  { td: "STLD",  db: "STLD",  type: "stock" },
  { td: "ALB",   db: "ALB",   type: "stock" },
  { td: "MP",    db: "MP",    type: "stock" },

  // Utilities
  { td: "NEE",   db: "NEE",   type: "stock" },
  { td: "SO",    db: "SO",    type: "stock" },
  { td: "DUK",   db: "DUK",   type: "stock" },
  { td: "AEP",   db: "AEP",   type: "stock" },
  { td: "D",     db: "D",     type: "stock" },
  { td: "EXC",   db: "EXC",   type: "stock" },
  { td: "SRE",   db: "SRE",   type: "stock" },
  { td: "PCG",   db: "PCG",   type: "stock" },
  { td: "ED",    db: "ED",    type: "stock" },
  { td: "ETR",   db: "ETR",   type: "stock" },
  { td: "PPL",   db: "PPL",   type: "stock" },
  { td: "WEC",   db: "WEC",   type: "stock" },
  { td: "CMS",   db: "CMS",   type: "stock" },
  { td: "LNT",   db: "LNT",   type: "stock" },
  { td: "NI",    db: "NI",    type: "stock" },

  // Real Estate
  { td: "PLD",   db: "PLD",   type: "stock" },
  { td: "EQIX",  db: "EQIX",  type: "stock" },
  { td: "PSA",   db: "PSA",   type: "stock" },
  { td: "AMT",   db: "AMT",   type: "stock" },
  { td: "CCI",   db: "CCI",   type: "stock" },
  { td: "SBAC",  db: "SBAC",  type: "stock" },
  { td: "O",     db: "O",     type: "stock" },
  { td: "SPG",   db: "SPG",   type: "stock" },
  { td: "EQR",   db: "EQR",   type: "stock" },
  { td: "VTR",   db: "VTR",   type: "stock" },
  { td: "WELL",  db: "WELL",  type: "stock" },
  { td: "ARE",   db: "ARE",   type: "stock" },
  { td: "BXP",   db: "BXP",   type: "stock" },
  { td: "KIM",   db: "KIM",   type: "stock" },
  { td: "REG",   db: "REG",   type: "stock" },

  // Communication Services — Media / Streaming
  { td: "NFLX",  db: "NFLX",  type: "stock" },
  { td: "DIS",   db: "DIS",   type: "stock" },
  { td: "CMCSA", db: "CMCSA", type: "stock" },
  { td: "PARA",  db: "PARA",  type: "stock" },
  { td: "WBD",   db: "WBD",   type: "stock" },
  { td: "FOXA",  db: "FOXA",  type: "stock" },
  { td: "NYT",   db: "NYT",   type: "stock" },
  { td: "SPOT",  db: "SPOT",  type: "stock" },

  // Communication Services — Telecom
  { td: "TMUS",  db: "TMUS",  type: "stock" },
  { td: "VZ",    db: "VZ",    type: "stock" },
  { td: "T",     db: "T",     type: "stock" },
  { td: "CHTR",  db: "CHTR",  type: "stock" },

  // Global / ADR
  { td: "TSM",   db: "TSM",   type: "stock" },
  { td: "ASML",  db: "ASML",  type: "stock" },
  { td: "SAP",   db: "SAP",   type: "stock" },
  { td: "NVO",   db: "NVO",   type: "stock" },
  { td: "AZN",   db: "AZN",   type: "stock" },
  { td: "SHEL",  db: "SHEL",  type: "stock" },
  { td: "BP",    db: "BP",    type: "stock" },
  { td: "TTE",   db: "TTE",   type: "stock" },
  { td: "UBS",   db: "UBS",   type: "stock" },
  { td: "BABA",  db: "BABA",  type: "stock" },
  { td: "BIDU",  db: "BIDU",  type: "stock" },
  { td: "JD",    db: "JD",    type: "stock" },
  { td: "PDD",   db: "PDD",   type: "stock" },
  { td: "NTES",  db: "NTES",  type: "stock" },
  { td: "MELI",  db: "MELI",  type: "stock" },
  { td: "NU",    db: "NU",    type: "stock" },
  { td: "SE",    db: "SE",    type: "stock" },
  { td: "GRAB",  db: "GRAB",  type: "stock" }

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


const fetchInitialHistory = async () => {
  console.log("Fetching initial OHLC history...");

  for (const s of SYMBOLS.slice(0, 50)) { // limit first
    try {
      const res = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${s.td}&interval=1min&outputsize=200&apikey=${process.env.TWELVEDATA_API_KEY}`
      );

      const data = await res.json();

      if (!data.values) {
        console.log("No data for", s.db);
        continue;
      }

      const rows = data.values.map(c => ({
        symbol: s.db,
        timestamp: c.datetime,
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
        volume: Number(c.volume || 0),
      }));

      const { error } = await supabase
        .from("candles")
        .upsert(rows, { onConflict: "symbol,timestamp" });

      if (error) {
        console.error("DB error:", error.message);
      } else {
        console.log(`History stored: ${s.db}`);
      }

    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  }
};
fetchInitialHistory();
setInterval(fetchInitialHistory, 60000);
