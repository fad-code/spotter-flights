import { useState } from "react";
import SearchForm from "./components/SearchForm.jsx";
import FlightCard from "./components/FlightCard.jsx";
import { searchFlightsV2 } from "./lib/api.js";

export default function App() {
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [sortBy, setSortBy] = useState("best");
  const [maxPrice, setMaxPrice] = useState("");

  async function handleSubmit(p) {
  setParams(p);
  setLoading(true);
  try {
    const data = await searchFlightsV2({
      from: p.from,
      to: p.to,
      depart: p.depart,
      ret: p.ret,
      adults: p.adults,
      cabin: p.cabin,
      currency: "USD",
      sortBy
    });
    setFlights(data);
  } catch (e) {
    console.error(e);
    setFlights([]);
  } finally {
    setLoading(false);
  }
}

  const list = flights
    .filter(f => (maxPrice ? f.price <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (sortBy === "duration") return (a.durationMinutes || 0) - (b.durationMinutes || 0);
      if (sortBy === "price") return (a.price || 0) - (b.price || 0);
      return (a.price || 0) - (b.price || 0); 
    });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-gradient-to-b from-white/80 to-white/30 dark:from-slate-950/80 dark:to-slate-900/30 backdrop-blur-sm border-b border-white/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold">Spotter <span className="text-pink-600">Flights</span></h1>
          <div className="hidden md:flex gap-3 text-sm opacity-80 items-center">
            <label>Sort</label>
            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="glass rounded-lg px-2 py-1">
              <option value="best">Best</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
            </select>
            <label className="ml-3">Max</label>
            <input type="number" min={0} value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} className="glass rounded-lg px-2 py-1 w-28" placeholder="USD" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <SearchForm onSubmit={handleSubmit} />

        {/* mobile controls */}
        <div className="md:hidden flex items-center justify-between mt-4 gap-3">
          <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="glass rounded-xl px-3 py-2 flex-1">
            <option value="best">Sort: Best</option>
            <option value="price">Sort: Price</option>
            <option value="duration">Sort: Duration</option>
          </select>
          <input type="number" min={0} value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} className="glass rounded-xl px-3 py-2 w-40" placeholder="Max price (USD)" />
        </div>

        <section className="mt-6 grid gap-4" aria-live="polite">
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 h-28 animate-pulse" />
          ))}
          {!loading && list.length === 0 && params && (
            <div className="glass rounded-2xl p-8 text-center opacity-80">
              No flights found. Try different dates or routes.
            </div>
          )}
          {!loading && list.map(f => <FlightCard key={f.id} f={f} />)}
        </section>
      </main>
    </div>
  );
}
