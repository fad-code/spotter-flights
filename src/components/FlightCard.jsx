import { Plane, Clock, CircleDot } from "lucide-react";

export default function FlightCard({ f }) {
  const h = Math.floor((f.durationMinutes ?? 0) / 60);
  const m = (f.durationMinutes ?? 0) % 60;

  return (
    <article className="glass rounded-2xl p-5 flex flex-col gap-3" aria-label="Flight result">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Plane className="opacity-70" aria-hidden />
          <div>
            <div className="font-semibold">{f.airline}</div>
            <div className="text-xs opacity-70">{f.airlineCode ?? ""}</div>
          </div>
        </div>
        <div className="text-2xl font-bold" aria-label={`Price ${f.currency} ${f.price}`}>{f.currency} {Number(f.price || 0).toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-3 items-center gap-3">
        <div className="text-center">
          <div className="text-xl font-semibold">{f.from}</div>
          <div className="text-xs opacity-70">
            {f.departTime ? new Date(f.departTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 opacity-80">
            <Clock className="size-4" aria-hidden />
            <span>{h}h {m}m</span>
          </div>
          <div className="text-xs opacity-70 flex items-center justify-center gap-1">
            <CircleDot className="size-3" aria-hidden /> {f.stops === 0 ? "Direct" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xl font-semibold">{f.to}</div>
          <div className="text-xs opacity-70">
            {f.arriveTime ? new Date(f.arriveTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </div>
        </div>
      </div>
    </article>
  );
}
