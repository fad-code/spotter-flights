import { useState } from "react";
import AirportAutocomplete from "./AirportAutocomplete.jsx";

const today = new Date().toISOString().slice(0, 10);

export default function SearchForm({ onSubmit }) {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [depart, setDepart] = useState(today);
  const [ret, setRet] = useState("");
  const [cabin, setCabin] = useState("ECONOMY");
  const [adults, setAdults] = useState(1);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit({ from, to, depart, ret: ret || undefined, cabin, adults }); }}
      className="glass rounded-2xl p-5 grid md:grid-cols-6 gap-4"
      aria-label="Flight search form"
    >
      <AirportAutocomplete label="From" value={from} onChange={setFrom} placeholder="City or airport" />
      <AirportAutocomplete label="To" value={to} onChange={setTo} placeholder="City or airport" />
      <div>
        <label className="block text-sm mb-1" htmlFor="depart">Depart</label>
        <input id="depart" type="date" value={depart} min={today} onChange={(e) => setDepart(e.target.value)} className="w-full glass rounded-xl px-4 py-3 focus:ring-2 ring-pink-400" />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="ret">Return (optional)</label>
        <input id="ret" type="date" value={ret} min={depart} onChange={(e) => setRet(e.target.value)} className="w-full glass rounded-xl px-4 py-3 focus:ring-2 ring-pink-400" />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="cabin">Cabin</label>
        <select id="cabin" value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full glass rounded-xl px-4 py-3">
          <option>ECONOMY</option><option>PREMIUM_ECONOMY</option><option>BUSINESS</option><option>FIRST</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="adults">Adults</label>
        <input id="adults" type="number" min={1} max={9} value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full glass rounded-xl px-4 py-3" />
      </div>

      <div className="md:col-span-6">
        <button disabled={!from || !to} className="w-full md:w-auto px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold disabled:opacity-50">
          Search flights
        </button>
        <p className="text-xs opacity-70 mt-2">Tip: pick from the dropdown so the app gets the required <code>skyId</code> and <code>entityId</code>.</p>
      </div>
    </form>
  );
}
