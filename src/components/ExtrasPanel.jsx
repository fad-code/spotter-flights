import { useState } from "react";
import {
  getLocale, checkServer, getConfig,
  getPriceCalendar, searchIncomplete, getFlightDetails,
  searchFlightsMultiStops, searchEverywhere, searchEverywhereDetails, searchWebComplete
} from "../lib/api.js";

function JsonView({ data }) {
  return (
    <pre className="whitespace-pre-wrap break-words text-xs glass rounded-xl p-3 max-h-80 overflow-auto">
      {data ? JSON.stringify(data, null, 2) : "—"}
    </pre>
  );
}

export default function ExtrasPanel({ from, to, depart }) {
  const [out, setOut] = useState(null);

  return (
    <div className="mt-8 glass rounded-2xl p-4">
      <div className="font-semibold mb-3">Advanced API Demo</div>
      <div className="grid md:grid-cols-3 gap-2">
        <button onClick={async()=>setOut(await getLocale())} className="px-3 py-2 glass rounded-lg hover:bg-white/70">getLocale</button>
        <button onClick={async()=>setOut(await checkServer())} className="px-3 py-2 glass rounded-lg hover:bg-white/70">checkServer</button>
        <button onClick={async()=>setOut(await getConfig())} className="px-3 py-2 glass rounded-lg hover:bg-white/70">getConfig</button>

        <button disabled={!from||!to} onClick={async()=>setOut(await getPriceCalendar({ from, to, fromDate: depart }))} className="px-3 py-2 glass rounded-lg hover:bg-white/70 disabled:opacity-40">getPriceCalendar</button>
        <button onClick={async()=>setOut(await searchIncomplete())} className="px-3 py-2 glass rounded-lg hover:bg-white/70">searchIncomplete</button>
        <button disabled={!from||!to} onClick={async()=>{
          setOut(await getFlightDetails({ originSkyId: from.skyId, destinationSkyId: to.skyId, date: depart }));
        }} className="px-3 py-2 glass rounded-lg hover:bg-white/70 disabled:opacity-40">getFlightDetails</button>

        <button disabled={!from||!to} onClick={async()=>{
          const legs = [{ origin: from.skyId, originEntityId: from.entityId, destination: to.skyId, destinationEntityId: to.entityId, date: depart }];
          setOut(await searchFlightsMultiStops({ legs }));
        }} className="px-3 py-2 glass rounded-lg hover:bg-white/70 disabled:opacity-40">searchFlightsMultiStops</button>

        <button disabled={!from} onClick={async()=>setOut(await searchEverywhere({ originEntityId: from?.entityId }))} className="px-3 py-2 glass rounded-lg hover:bg-white/70 disabled:opacity-40">searchFlightEverywhere</button>
        <button onClick={async()=>setOut(await searchEverywhereDetails({}))} className="px-3 py-2 glass rounded-lg hover:bg-white/70">everywhereDetails</button>

        <button disabled={!from||!to} onClick={async()=>setOut(await searchWebComplete({ from, to }))} className="px-3 py-2 glass rounded-lg hover:bg-white/70 disabled:opacity-40">searchFlightsWebComplete</button>
      </div>

      <div className="mt-3">
        <JsonView data={out} />
      </div>
    </div>
  );
}
