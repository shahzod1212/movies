import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, MapPin, Ticket, Film } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { fetchShowtimesByDate } from "../redux/showtimeSlice";

const STATUS_STYLES = {
  SCHEDULED: "bg-white/10 text-stone-300",
  ONGOING: "bg-amber-400/15 text-amber-400",
  COMPLETED: "bg-stone-700/40 text-stone-500",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const toLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateNextDays = (count = 14) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);

    let label = "";
    if (i === 0) label = "Today";
    else if (i === 1) label = "Tomorrow";

    days.push({
      label,
      day: String(current.getDate()).padStart(2, "0"),
      month: MONTHS[current.getMonth()],
      weekday: WEEKDAYS[current.getDay()],
      date: current,
      isoDate: toLocalDateString(current),
      isFirstOfMonth: current.getDate() === 1 || i === 0,
    });
  }

  return days;
};

const ShowtimePage = () => {
  const filteredShowtimes = useSelector(
    (state) => state.showtime.filteredShowtimes,
  );
  const dates = useMemo(() => generateNextDays(14), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].isoDate);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShowtimesByDate(dates[0].isoDate));
  }, []);

  function handleFetchByDate(isoDate) {
    setSelectedDate(isoDate);
    dispatch(fetchShowtimesByDate(isoDate));
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar />

      <div className="flex-1 px-5 sm:px-10 pt-24 sm:pt-28 pb-16">
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-stone-100">
          Showtimes
        </h1>
        <p className="mt-1 text-xs text-stone-400">
          Pick a date and find your next screening.
        </p>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {dates.map((d) => (
            <div
              key={d.isoDate}
              onClick={() => handleFetchByDate(d.isoDate)}
              className={`flex flex-shrink-0 flex-col items-center rounded-xl px-4 py-2.5 transition-colors cursor-pointer ${
                d.isoDate === selectedDate
                  ? "bg-amber-400 text-zinc-950"
                  : "bg-white/5 text-stone-300 hover:bg-white/10"
              }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                {d.label || d.weekday}
              </span>
              <span className="font-display text-lg leading-none">{d.day}</span>
              {d.isFirstOfMonth && (
                <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider opacity-70">
                  {d.month}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {filteredShowtimes.map((showtime) => (
            <MovieCard key={showtime.id} showtime={showtime} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShowtimePage;
