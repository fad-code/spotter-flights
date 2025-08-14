import axios from "axios";
export const api = axios.create({ baseURL: "/api" });


function normalizeAirports(payload) {
  const arr = Array.isArray(payload?.data) ? payload.data : [];
  return arr.map((it, i) => ({
    id: String(it.entityId ?? i),
    name: it.name || it.city || "",
    city: it.city || it.presentation?.subtitle || "",
    country: it.countryName || it.country || "",
    iata: it.iata || it.code || "",        
    skyId: it.skyId,                         
    entityId: String(it.entityId)            
  })).filter(a => a.skyId && a.entityId);
}

const memo = new Map();
export async function fetchAirports(query) {
  const key = (query || "").trim().toLowerCase();
  if (!key) return [];
  if (memo.has(key)) return memo.get(key);
  const { data } = await api.get("/sky/autocomplete", { params: { query } });
  const list = normalizeAirports(data).slice(0, 10);
  memo.set(key, list);
  return list;
}


function normalizeFlights(payload) {
  const items = payload?.data ?? [];
  return items.map((it, i) => {
    const leg = it.legs?.[0] ?? {};
    return {
      id: it.id ?? String(i),
      price: Number(it.price?.raw ?? it.price ?? 0),
      currency: it.price?.currency ?? "USD",
      airline: leg?.carriers?.marketing?.[0]?.name ?? "Airline",
      airlineCode: leg?.carriers?.marketing?.[0]?.code,
      from: leg?.origin?.displayCode ?? leg?.origin ?? "",
      to: leg?.destination?.displayCode ?? leg?.destination ?? "",
      departTime: leg?.departure ?? "",
      arriveTime: leg?.arrival ?? "",
      durationMinutes: leg?.durationInMinutes ?? 0,
      stops: leg?.stopCount ?? 0
    };
  });
}

export async function searchFlightsV2({
  from,
  to,
  depart,
  ret,
  adults = 1,
  cabin = "ECONOMY",
  currency = "USD",
  sortBy = "best",
}) {
  const params = {
    originSkyId: from.skyId,
    destinationSkyId: to.skyId,
    originEntityId: from.entityId,
    destinationEntityId: to.entityId,
    cabinClass: cabin.toLowerCase(),
    adults,
    sortBy,
    currency,
    market: "en-US",
    countryCode: "US",
    date: depart
  };

  if (ret && /^\d{4}-\d{2}-\d{2}$/.test(ret)) {
    params.returnDate = ret;
  }

  const { data } = await api.get("/sky/search-flights", { params });
  return normalizeFlights(data);
}
