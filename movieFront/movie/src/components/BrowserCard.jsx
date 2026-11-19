import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BrowseCard({ movie }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg ring-1 ring-white/10">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-stone-100">
            {movie.originalRating}
          </span>
        </div>
      </div>
      <p className="mt-2 truncate text-xs font-bold text-stone-100">
        {movie.title}
      </p>
      <p className="text-[10.5px] text-stone-400">
        {movie.genre} · {movie.durationTime}
      </p>
    </div>
  );
}
