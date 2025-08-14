import { useQuery } from "@tanstack/react-query";
import { fetchAirports } from "../lib/api.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AirportAutocomplete({ label, value, onChange, placeholder }) {
  const [q, setQ] = useState(value ? `${value.iata || value.skyId} — ${value.name}` : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const dq = useDebounce(q, 250);

  const enabled = dq.trim().length >= 2;
  const { data = [], isFetching } = useQuery({
    queryKey: ["airports", dq],
    queryFn: () => fetchAirports(dq),
    enabled
  });

  useEffect(() => { if (open) setActive(0); }, [dq, open]);

  const suggestions = enabled ? data : [];

  const select = (a) => {
    onChange(a);
    setQ(`${a.iata || a.skyId} — ${a.name}`);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter")     { e.preventDefault(); if (suggestions[active]) select(suggestions[active]); }
    if (e.key === "Escape")    { e.preventDefault(); setOpen(false); }
  };

  return (
    <div className="relative">
      <label className="block text-sm mb-1" htmlFor={`ac-${label}`}>{label}</label>
      <div className="flex items-center glass rounded-2xl px-3 focus-within:ring-2 ring-pink-400">
        <Search className="size-4 opacity-60" aria-hidden />
        <input
          id={`ac-${label}`}
          className="w-full bg-transparent px-2 py-3 outline-none"
          value={q}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQ(e.target.value); onChange(null); setOpen(true); }}
          onKeyDown={onKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`list-${label}`}
        />
        {q && (
          <button type="button" aria-label="Clear" onClick={() => { setQ(""); onChange(null); setOpen(true); }}
            className="p-1 opacity-60 hover:opacity-100">
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && (
        <div id={`list-${label}`} role="listbox" className="absolute z-20 mt-2 w-full max-h-72 overflow-auto glass rounded-2xl p-2">
          {isFetching && enabled && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm opacity-70">
              <Loader2 className="size-4 animate-spin" /> Searching…
            </div>
          )}

          {!isFetching && enabled && suggestions.length === 0 && (
            <div className="px-3 py-2 text-sm opacity-70">No results. Try another city or code.</div>
          )}

          {suggestions.map((a, idx) => (
            <button
              type="button"
              key={`${a.entityId}-${idx}`}
              role="option"
              aria-selected={active === idx}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(a)}
              onMouseEnter={() => setActive(idx)}
              className={`w-full text-left px-3 py-2 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 ${active===idx ? "bg-white/60 dark:bg-white/10" : ""}`}
            >
              <span className="font-semibold">{a.iata || a.skyId}</span> · {a.name}
              {a.city ? ` (${a.city}${a.country ? ", " + a.country : ""})` : ""}
            </button>
          ))}

          <div className="px-3 pt-1 text-[11px] opacity-60">
            Tip: type city name or IATA code, use ↑/↓ and <b>Enter</b>.
          </div>
        </div>
      )}
    </div>
  );
}
