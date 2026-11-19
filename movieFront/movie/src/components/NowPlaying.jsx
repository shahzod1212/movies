import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MovieCard from "../components/MovieCard";
import { fetchShowtimesByDate } from "../redux/showtimeSlice";

const toLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const NowPlaying = () => {
  const showtimes = useSelector((state) => state.showtime.filteredShowtimes);
  const dispatch = useDispatch();
  const today = new Date();

  useEffect(() => {
    dispatch(fetchShowtimesByDate(toLocalDateString(today)));
  }, [dispatch]);

  return (
    <div className="font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-stone-100">
        {formatDisplayDate(today)}
      </h1>
      <p className="mt-1 text-xs text-stone-400">
        Showtimes for today, {toLocalDateString(today)}.
      </p>

      {showtimes.length === 0 ? (
        <p className="mt-10 text-sm text-stone-500">
          No showtimes scheduled for today.
        </p>
      ) : (
        <div className="mt-8 flex flex-wrap gap-4">
          {showtimes.map((showtime) => (
            <MovieCard key={showtime.id} showtime={showtime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NowPlaying;
