import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use((_, res, next) => { res.set("Cache-Control", "no-store"); next(); });

const BASE = "https://sky-scrapper.p.rapidapi.com";
const HEADERS = {
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
  "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com"
};

app.get("/api/health", (_req, res) => res.json({ ok: true, hasKey: !!process.env.RAPIDAPI_KEY }));


app.get("/api/sky/autocomplete", async (req, res) => {
  const query = req.query.query || req.query.q;
  if (!query) return res.status(400).json({ error: "Missing ?query" });
  try {
    const url = `${BASE}/api/v1/flights/searchAirport`;
    const { data } = await axios.get(url, { headers: HEADERS, params: { query, locale: "en-US" }, timeout: 20000 });
    res.json(data);
  } catch (e) {
    const r = e?.response;
    res.status(r?.status || 502).json({ error: "searchAirport failed", details: r?.data ?? e.message });
  }
});

app.get("/api/sky/search-flights", async (req, res) => {
  const p = {
    originSkyId: req.query.originSkyId,
    destinationSkyId: req.query.destinationSkyId,
    originEntityId: req.query.originEntityId,
    destinationEntityId: req.query.destinationEntityId,
    cabinClass: req.query.cabinClass || "economy",
    adults: req.query.adults || 1,
    sortBy: req.query.sortBy || "best",
    currency: req.query.currency || "USD",
    market: req.query.market || "en-US",
    countryCode: req.query.countryCode || "US",
    date: req.query.date
  };

  if (req.query.returnDate && /^\d{4}-\d{2}-\d{2}$/.test(req.query.returnDate)) {
    p.returnDate = req.query.returnDate;
  }

  for (const k of ["originSkyId","destinationSkyId","originEntityId","destinationEntityId","date"]) {
    if (!p[k]) return res.status(400).json({ error: `Missing ${k}` });
  }

  try {
    const url = `${BASE}/api/v2/flights/searchFlights`;
    const { data } = await axios.get(url, { headers: HEADERS, params: p, timeout: 30000 });
    res.json(data);
  } catch (e) {
    const r = e?.response;
    res.status(r?.status || 502).json({ error: "searchFlights failed", details: r?.data ?? e.message });
  }
});

const PORT = Number(process.env.PORT || 8787);
app.listen(PORT, () => console.log(`API server on http://localhost:${PORT}`));

app.get("/api/sky/debug-echo", (req, res) => {
  res.json({ received: req.query });
});