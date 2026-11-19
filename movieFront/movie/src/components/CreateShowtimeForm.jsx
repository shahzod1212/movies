import React, { useEffect, useState } from "react";
import {
  CalendarClock,
  Film,
  DoorOpen,
  Calendar,
  Clock,
  Timer,
  Check,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovies } from "../redux/movieSlice";
import { fetchAllRoomsStore } from "../redux/roomSlice";
import { createShowtime } from "../axios/apis";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-lg border border-stone-700 bg-white/5 py-2.5 px-3.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition-colors focus:border-amber-400 focus:bg-amber-400/5";

function FieldLabel({ icon: Icon, children }) {
  return (
    <label className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
      <Icon className="h-3 w-3" />
      {children}
    </label>
  );
}

function MovieCard({ movie, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(movie.id)}
      className={`relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border text-left transition-colors ${
        selected
          ? "border-amber-400 bg-amber-400/5"
          : "border-white/5 bg-white/[0.02] hover:border-white/10"
      }`}
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center px-3 py-2">
        <p className="truncate text-sm font-bold text-stone-200">
          {movie.title}
        </p>
      </div>
      {selected && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-zinc-950">
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

function RoomCard({ room, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(room.id)}
      className={`relative flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-amber-400 bg-amber-400/5"
          : "border-white/5 bg-white/[0.02] hover:border-white/10"
      }`}
    >
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
        <DoorOpen className="h-4 w-4 text-stone-400" />
      </span>
      <p className="text-sm font-semibold text-stone-200">{room.name}</p>
      {selected && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-zinc-950">
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

const CreateShowtimeForm = () => {
  const [showMoviePicker, setShowMoviePicker] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movie.movies);
  const rooms = useSelector((state) => state.room.rooms);
  const selectedMovie = movies.find((m) => m.id === selectedMovieId);
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  useEffect(() => {
    dispatch(fetchAllMovies());
    dispatch(fetchAllRoomsStore());
  }, [dispatch]);

  const isFormValid =
    selectedMovie &&
    selectedRoom &&
    date &&
    time &&
    hour !== "" &&
    minute !== "";

  async function handleSubmitShowtime() {
    if (!isFormValid) {
      setError("Please fill in all fields before creating the showtime.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const form = {
      movieId: selectedMovie.id,
      roomId: selectedRoom.id,
      date,
      startTime: time,
      durationHour: Number(hour),
      durationMinute: Number(minute),
    };

    try {
      const response = await createShowtime(form);

      if (response.status === 200) {
        toast.success("Succefully created");
        setSelectedMovieId(null);
        setSelectedRoomId(null);
        setShowMoviePicker(false);
        setShowRoomPicker(false);
        setDate("");
        setTime("");
        setHour("");
        setMinute("");
      }
    } catch (err) {
      setError(err?.message ?? "Failed to create showtime. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-900">
          <CalendarClock className="h-5 w-5 text-stone-50" />
        </span>
        <div>
          <h1 className="font-display text-3xl tracking-wide text-stone-100">
            Create Showtime
          </h1>
          <p className="text-xs text-stone-400">
            Schedule a movie in a screening room.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
            <Film className="h-3 w-3" />
            Movie
          </p>
          <button
            type="button"
            onClick={() => setShowMoviePicker((v) => !v)}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-300 transition-colors hover:bg-white/10"
          >
            {showMoviePicker ? "Hide movies" : "Select movie"}
          </button>
        </div>

        {selectedMovie && !showMoviePicker && (
          <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
            <Film className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-semibold text-stone-200">
              {selectedMovie.title}
            </p>
          </div>
        )}

        {!selectedMovie && !showMoviePicker && (
          <p className="text-xs text-stone-500">No movie selected yet.</p>
        )}

        {showMoviePicker && (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {movies.map((movie) => (
              <div key={movie.id} className="w-32 flex-shrink-0">
                <MovieCard
                  movie={movie}
                  selected={selectedMovieId === movie.id}
                  onSelect={(id) => {
                    setSelectedMovieId(id);
                    setShowMoviePicker(false);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
            <DoorOpen className="h-3 w-3" />
            Room
          </p>
          <button
            type="button"
            onClick={() => setShowRoomPicker((v) => !v)}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-300 transition-colors hover:bg-white/10"
          >
            {showRoomPicker ? "Hide rooms" : "Select room"}
          </button>
        </div>

        {selectedRoom && !showRoomPicker && (
          <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
            <DoorOpen className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-semibold text-stone-200">
              {selectedRoom.name}
            </p>
          </div>
        )}

        {!selectedRoom && !showRoomPicker && (
          <p className="text-xs text-stone-500">No room selected yet.</p>
        )}

        {showRoomPicker && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                selected={selectedRoomId === room.id}
                onSelect={(id) => {
                  setSelectedRoomId(id);
                  setShowRoomPicker(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <p className="mb-4 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
          Date & Time
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={Calendar}>Date</FieldLabel>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={Clock}>Start Time</FieldLabel>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={Timer}>Duration (hours)</FieldLabel>
            <input
              type="number"
              min="0"
              placeholder="e.g. 2"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={Timer}>Duration (minutes)</FieldLabel>
            <input
              type="number"
              min="0"
              max="59"
              placeholder="e.g. 15"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-900/20 px-4 py-2.5 text-xs font-semibold text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        <span className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-bold text-stone-400 hover:text-stone-200">
          Cancel
        </span>
        <button
          type="button"
          onClick={handleSubmitShowtime}
          disabled={submitting}
          className="rounded-lg bg-red-900 px-6 py-2.5 text-sm font-extrabold tracking-wide text-stone-50 shadow-lg shadow-red-950/50 transition-all hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {submitting ? "Creating..." : "Create Showtime"}
        </button>
      </div>
    </div>
  );
};

export default CreateShowtimeForm;
