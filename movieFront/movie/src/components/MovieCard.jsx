import React from "react";
import { Star, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

function formatTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = Number(hour);
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${minute} ${period}`;
}

export default function MovieCard({ showtime }) {
  const { movie, room, date, startTime, showtimeStatus } = showtime;

  return (
    <Link
      to={`/showtime/${showtime.id}`}
      className="group relative block flex-shrink-0 w-[168px] sm:w-[188px] cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-white/10">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold text-white">
            {movie.rating}
          </span>
        </div>
        {showtimeStatus && (
          <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-white">
              {showtimeStatus.replaceAll("_", " ")}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="font-display text-lg leading-tight tracking-wide text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
            {movie.title}
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-stone-100">
            {movie.genres.slice(0, 2).join(" · ")}
          </p>
          {(date || startTime || room) && (
            <p className="mt-1.5 inline-block rounded bg-black/50 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-100">
              {date} {startTime && `· ${formatTime(startTime)}`}
              {room?.name && ` · ${room.name}`}
            </p>
          )}
          <div className="mt-2 flex translate-y-2 items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Ticket className="h-3 w-3 text-amber-400" />
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-400">
              Book tickets
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
