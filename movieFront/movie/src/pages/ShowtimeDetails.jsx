import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  Film,
  Globe,
  MapPin,
  Building2,
  DoorOpen,
  Timer,
  Ticket,
  Armchair,
} from "lucide-react";
import { fetchShowtimeById } from "../redux/showtimeSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TicketModal from "../components/TicketModal";

const STATUS_STYLES = {
  SCHEDULED: "bg-white/10 text-stone-300 ring-white/10",
  ONGOING: "bg-red-500/15 text-red-400 ring-red-500/30",
  COMPLETED: "bg-stone-700/40 text-stone-500 ring-stone-700/40",
};

const ShowtimeDetails = () => {
  const selectedShowtime = useSelector(
    (state) => state.showtime.selectedShowtime,
  );
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchShowtimeById(id));
    }
  }, [dispatch, id]);

  if (!selectedShowtime) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-sm text-red-400">Loading showtime…</p>
      </div>
    );
  }

  const {
    movie,
    room,
    date,
    startTime,
    durationHour,
    durationMinute,
    status,
    showtimeStatus,
  } = selectedShowtime;
  const actorEntries = movie?.actors ? Object.entries(movie.actors) : [];
  const statusClass = STATUS_STYLES[showtimeStatus] || STATUS_STYLES.SCHEDULED;
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
      `}</style>

      <Navbar />

      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={movie?.backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/60 via-black/10 to-transparent" />

        <div className="relative z-10 flex h-full items-end px-5 pb-16 sm:px-10">
          <div className="max-w-xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ring-1 ${statusClass}`}
              >
                {showtimeStatus}
              </span>
              {movie?.genres?.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-red-950/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300 backdrop-blur-sm ring-1 ring-red-800/40"
                >
                  {g}
                </span>
              ))}
            </div>

            <h1 className="font-display text-5xl leading-none tracking-wide text-white sm:text-7xl">
              {movie?.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-red-300">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-red-500 text-red-500" />
                <span className="font-bold text-red-300">{movie?.rating}</span>
                {movie?.originalRating != null && (
                  <span className="text-xs text-red-500/70">
                    (orig. {movie.originalRating})
                  </span>
                )}
              </span>
              {movie?.durationTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {movie.durationTime}
                </span>
              )}
              {movie?.ageRating && (
                <span className="rounded border border-red-800 px-1.5 py-0.5 text-[10px] font-bold text-red-300">
                  {movie.ageRating}
                </span>
              )}
            </div>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white">
              {movie?.description}
            </p>
          </div>
        </div>
      </section>

      {actorEntries.length > 0 && (
        <section className="px-5 py-10 sm:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 font-display text-2xl tracking-wide text-red-500">
              Starring
            </h2>
            <div className="flex items-start gap-6 overflow-x-auto pb-2">
              {actorEntries.map(([name, imageUrl]) => (
                <div
                  key={name}
                  className="flex shrink-0 flex-col items-center gap-1.5"
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-red-800/50"
                    draggable={false}
                  />
                  <span className="max-w-[72px] truncate text-center text-[10px] text-red-300">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Showtime session — ticket-stub styled card */}
      <section className="px-5 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 font-display text-2xl tracking-wide text-red-500">
            Your Session
          </h2>

          <div className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-900 ring-1 ring-red-900/40 sm:flex-row">
            {/* perforated divider */}
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-0 border-l-2 border-dashed border-red-900/40 sm:left-[72%] sm:block" />
            <div className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-950 sm:left-[calc(72%-12px)] sm:block" />
            <div className="absolute -bottom-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-zinc-950 sm:hidden" />

            <div className="grid flex-1 grid-cols-2 gap-6 p-6 sm:grid-cols-4 sm:p-8">
              <SessionStat icon={Calendar} label="Date" value={date} />
              <SessionStat icon={Clock} label="Start Time" value={startTime} />
              <SessionStat
                icon={Timer}
                label="Duration"
                value={
                  durationHour != null && durationMinute != null
                    ? `${durationHour}h ${durationMinute}m`
                    : null
                }
              />
              <SessionStat icon={DoorOpen} label="Room" value={room?.name} />
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-dashed border-red-900/40 p-6 sm:w-[28%] sm:border-l sm:border-t-0 sm:p-8">
              <Armchair className="h-8 w-8 shrink-0 text-red-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-red-400">
                  Room Type
                </p>
                <p className="text-sm font-bold text-white">
                  {room?.type || "Standard"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie info — interactive hover cards */}
      <section className="px-5 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 font-display text-2xl tracking-wide text-red-500">
            About the Movie
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoCard icon={Film} label="Movie Status" value={status} />
            <InfoCard icon={Globe} label="Language" value={movie?.language} />
            <InfoCard icon={Film} label="Director" value={movie?.director} />
            <InfoCard icon={Building2} label="Studio" value={movie?.studio} />
            <InfoCard
              icon={MapPin}
              label="Filming Location"
              value={movie?.filmingLocation}
            />
            <InfoCard
              icon={Film}
              label="Formats"
              value={movie?.formats?.join(", ")}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl flex justify-center">
          <button
            onClick={() => setOpenModal(true)}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-red-700 to-orange-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-900/40 transition-all hover:from-red-600 hover:to-orange-500 hover:shadow-red-800/50 hover:scale-[1.03]"
          >
            <Ticket className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            Book the Ticket
          </button>
        </div>
      </section>
      {openModal && (
        <TicketModal
          onClose={() => setOpenModal(false)}
          showtime={selectedShowtime}
        />
      )}

      <Footer />
    </div>
  );
};

function SessionStat({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
        <Icon className="h-4 w-4 text-red-500" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-red-400">
          {label}
        </p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="group relative overflow-hidden rounded-xl bg-red-950/20 p-4 ring-1 ring-red-900/40 transition-all hover:-translate-y-1 hover:bg-red-950/30 hover:ring-red-700/50 hover:shadow-lg hover:shadow-red-950/30">
      <Icon className="h-4 w-4 text-red-500 transition-transform group-hover:scale-110" />
      <p className="mt-2 text-[10px] uppercase tracking-wider text-red-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-red-500 transition-transform group-hover:scale-x-100" />
    </div>
  );
}

export default ShowtimeDetails;
