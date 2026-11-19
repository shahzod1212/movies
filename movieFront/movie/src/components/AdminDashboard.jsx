import React, { useEffect } from "react";
import {
  Film,
  DoorOpen,
  CalendarClock,
  Ticket,
  TrendingUp,
  Plus,
  Clock,
  Star,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovies } from "../redux/movieSlice";
import { fetchAllRoomsStore } from "../redux/roomSlice";
import { fetchAllShowtime } from "../redux/showtimeSlice";

const QUICK_ACTIONS = [
  {
    label: "Create Movie",
    description: "Add a new title with poster, cast, and details.",
    icon: Film,
  },
  {
    label: "Create Room",
    description: "Set up a new screening room and seat layout.",
    icon: DoorOpen,
  },
  {
    label: "Create Showtime",
    description: "Schedule a movie into a room and date.",
    icon: CalendarClock,
  },
];

const formatHeaderDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function AdminDashboard({ onSelect }) {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movie.movies);
  const rooms = useSelector((state) => state.room.rooms);
  const showtimes = useSelector((state) => state.showtime.filteredShowtimes);
  const today = new Date();

  useEffect(() => {
    dispatch(fetchAllMovies());
    dispatch(fetchAllRoomsStore());
    dispatch(fetchAllShowtime());
  }, [dispatch]);

  const STATS = [
    {
      label: "Total Movies",
      value: movies.length,
      icon: Film,
      accent: "text-amber-400",
    },
    {
      label: "Total Rooms",
      value: rooms.length,
      icon: DoorOpen,
      accent: "text-emerald-400",
    },
    {
      label: "Showtimes Today",
      value: showtimes.length,
      icon: CalendarClock,
      accent: "text-sky-400",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-stone-100">
            Dashboard
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            Overview of your cinema, right now.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3.5 py-2 text-xs text-stone-400">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          {formatHeaderDate(today)}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/20"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ${accent}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                Live
              </span>
            </div>
            <p className="mt-4 font-display text-3xl text-stone-100">{value}</p>
            <p className="mt-0.5 text-xs text-stone-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="mb-3 text-[10.5px] font-bold uppercase tracking-widest text-stone-500">
          Quick actions
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUICK_ACTIONS.map(({ label, description, icon: Icon }) => (
            <div
              key={label}
              onClick={() => onSelect(label)}
              className="group cursor-pointer rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-800/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-900 text-stone-50">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-stone-400 transition-colors group-hover:bg-amber-400 group-hover:text-zinc-950">
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-4 font-display text-xl tracking-wide text-stone-100">
                {label}
              </p>
              <p className="mt-1 text-xs text-stone-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
