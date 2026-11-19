import React from "react";
import { Clapperboard, Users, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ACCENT_BY_TYPE = {
  IMAX: "from-red-900 to-red-950",
  STANDARD: "from-zinc-800 to-zinc-950",
  VIP: "from-amber-700 to-amber-950",
  FOUR_DX: "from-sky-800 to-sky-950",
  THREE_D: "from-violet-800 to-violet-950",
};

const DEFAULT_ACCENT = "from-zinc-800 to-zinc-950";

function lowestPrice(room) {
  const prices = [
    room.frontPrice,
    room.middlePrice,
    room.wingPrice,
    room.topPrice,
  ].filter((p) => p > 0);

  if (prices.length === 0) return 0;

  return Math.min(...prices);
}

export default function RoomCard({ room, className = "" }) {
  const accent = ACCENT_BY_TYPE[room.roomType] ?? DEFAULT_ACCENT;
  const navigate = useNavigate();

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${accent} p-5 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
          {room.roomType}
        </span>
        <Clapperboard className="h-5 w-5 text-white/40" />
      </div>

      <h3 className="font-display line-clamp-2 text-2xl leading-tight tracking-wide text-white">
        {room.name}
      </h3>

      <div className="mt-4 flex flex-col gap-2 text-xs text-stone-200/90">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-white/60" />
          <span>{room.totalSeats} seats</span>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className="h-3.5 w-3.5 text-white/60" />
          <span>{room.soundSystem.replaceAll("_", " ")}</span>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/50">
            From
          </p>
          <p className="font-display text-xl text-amber-300">
            ${lowestPrice(room).toFixed(2)}
          </p>
        </div>
        <span
          onClick={() => navigate(`/room/${room.id}`)}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          View room →
        </span>
      </div>
    </div>
  );
}
