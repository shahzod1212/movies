import React, { useState } from "react";
import {
  Film,
  Image as ImageIcon,
  Video,
  Play,
  Clock,
  Calendar,
  Languages,
  User,
  Star,
  Building2,
  MapPin,
  ShieldCheck,
  Tag,
  Users,
  Plus,
  X,
  Clapperboard,
} from "lucide-react";
import { createMovie } from "../axios/apis";
import { toast } from "sonner";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Adventure",
  "Animation",
  "Thriller",
];
const FORMATS = ["2D", "3D", "IMAX"];
const AGE_RATINGS = ["G", "PG", "PG-13", "R", "NC-17"];

function FieldLabel({ icon: Icon, children }) {
  return (
    <label className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
      <Icon className="h-3 w-3" />
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-stone-700 bg-white/5 py-2.5 px-3.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition-colors focus:border-amber-400 focus:bg-amber-400/5";

function extractYouTubeId(value) {
  if (!value) return "";
  const trimmed = value.trim();
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  return "";
}

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

let actorSeq = 2;

function initialCast() {
  actorSeq = 2;
  return [
    { id: 0, name: "", image: "", broken: false },
    { id: 1, name: "", image: "", broken: false },
  ];
}

export default function CreateMovieForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studio, setStudio] = useState("");
  const [director, setDirector] = useState("");

  const [posterUrl, setPosterUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");
  const [trailerInput, setTrailerInput] = useState("");
  const [posterBroken, setPosterBroken] = useState(false);
  const [backdropBroken, setBackdropBroken] = useState(false);

  const [duration, setDuration] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [language, setLanguage] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [ageRating, setAgeRating] = useState(AGE_RATINGS[1]);

  const [genres, setGenres] = useState([]);
  const [format, setFormat] = useState(FORMATS[0]);

  const [cast, setCast] = useState(initialCast());

  const trailerId = extractYouTubeId(trailerInput);

  function resetForm() {
    setTitle("");
    setDescription("");
    setStudio("");
    setDirector("");
    setPosterUrl("");
    setBackdropUrl("");
    setTrailerInput("");
    setPosterBroken(false);
    setBackdropBroken(false);
    setDuration("");
    setReleaseDate("");
    setLanguage("");
    setLocation("");
    setRating("");
    setAgeRating(AGE_RATINGS[1]);
    setGenres([]);
    setFormat(FORMATS[0]);
    setCast(initialCast());
  }

  async function handleSubmit() {
    const actorsMap = cast.reduce((acc, a) => {
      if (a.name.trim()) acc[a.name] = a.image;
      return acc;
    }, {});

    const form = {
      title,
      description,
      posterUrl,
      backdropUrl,
      trailerUrl: trailerId,
      durationTime: duration,
      releaseDate,
      genres,
      language,
      actors: actorsMap,
      director,
      originalRating: rating ? Number(rating) : null,
      studio,
      filmingLocation: location,
      ageRating,
      formats: [format],
    };

    try {
      const response = await createMovie(form);

      if (response.status === 201) {
        toast.success("Successfully added");
        resetForm();
      }
    } catch (err) {
      toast.error(`Failed to create movie: ${err.message}`);
    }
  }

  function toggleGenre(g) {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  }

  function updateActor(id, field, value) {
    setCast((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              [field]: value,
              ...(field === "image" ? { broken: false } : {}),
            }
          : a,
      ),
    );
  }

  function addActor() {
    setCast((prev) => [
      ...prev,
      { id: actorSeq++, name: "", image: "", broken: false },
    ]);
  }

  function removeActor(id) {
    setCast((prev) => prev.filter((a) => a.id !== id));
  }

  const filledCast = cast.filter((a) => a.name.trim());
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-900">
          <Film className="h-5 w-5 text-stone-50" />
        </span>
        <div>
          <h1 className="font-display text-3xl tracking-wide text-stone-100">
            Create Movie
          </h1>
          <p className="text-xs text-stone-400">
            Add a new title to the catalog. The preview on the right updates as
            you type.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ───────────────────── FORM ───────────────────── */}
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <p className="mb-4 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
              Basic Info
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <FieldLabel icon={Film}>Title</FieldLabel>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Avengers: Doomsday"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <FieldLabel icon={Film}>
                  Description{" "}
                  <span className="text-gray-300 text-xs">max-2 lines</span>
                </FieldLabel>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short synopsis of the movie..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={Building2}>Studio</FieldLabel>
                <input
                  type="text"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  placeholder="e.g. Warner Bros."
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={User}>Director</FieldLabel>
                <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  placeholder="e.g. Denis Villeneuve"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <p className="mb-4 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
              Media
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={ImageIcon}>Poster URL</FieldLabel>
                <input
                  type="text"
                  value={posterUrl}
                  onChange={(e) => {
                    setPosterUrl(e.target.value);
                    setPosterBroken(false);
                  }}
                  placeholder="https://..."
                  className={inputClass}
                />
                {posterUrl && posterBroken && (
                  <p className="text-[10.5px] font-semibold text-red-400">
                    Couldn't load that image — check the URL.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={ImageIcon}>Backdrop URL</FieldLabel>
                <input
                  type="text"
                  value={backdropUrl}
                  onChange={(e) => {
                    setBackdropUrl(e.target.value);
                    setBackdropBroken(false);
                  }}
                  placeholder="https://..."
                  className={inputClass}
                />
                {backdropUrl && backdropBroken && (
                  <p className="text-[10.5px] font-semibold text-red-400">
                    Couldn't load that image — check the URL.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <FieldLabel icon={Video}>
                  Trailer (YouTube URL or ID)
                </FieldLabel>
                <input
                  type="text"
                  value={trailerInput}
                  onChange={(e) => setTrailerInput(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or dQw4w9WgXcQ"
                  className={inputClass}
                />
                {trailerInput && !trailerId && (
                  <p className="text-[10.5px] font-semibold text-red-400">
                    That doesn't look like a valid YouTube link or ID.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <p className="mb-4 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
              Details
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={Clock}>Duration</FieldLabel>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2h 45m"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={Calendar}>Release Date</FieldLabel>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={Languages}>Language</FieldLabel>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. English"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={MapPin}>Filming Location</FieldLabel>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Atlanta, Georgia"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={Star}>Rating</FieldLabel>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="e.g. 8.4"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={ShieldCheck}>Age Rating</FieldLabel>
                <select
                  value={ageRating}
                  onChange={(e) => setAgeRating(e.target.value)}
                  className={inputClass}
                >
                  {AGE_RATINGS.map((r) => (
                    <option key={r} value={r} className="bg-zinc-900">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <p className="mb-4 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
              <Tag className="h-3 w-3" />
              Genres
            </p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => {
                const active = genres.includes(genre);
                return (
                  <button
                    type="button"
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      active
                        ? "bg-amber-400 text-zinc-950"
                        : "bg-white/5 text-stone-300 hover:bg-white/10 hover:text-stone-100"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>

            <p className="mb-3 mt-6 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
              Formats
            </p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => {
                const active = format === f;
                return (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      active
                        ? "bg-red-900 text-stone-50"
                        : "bg-white/5 text-stone-300 hover:bg-white/10 hover:text-stone-100"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
                <Users className="h-3 w-3" />
                Cast
              </p>
              <button
                type="button"
                onClick={addActor}
                className="flex cursor-pointer items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-300 transition-colors hover:bg-white/10"
              >
                <Plus className="h-3.5 w-3.5" />
                Add actor
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {cast.map((actor) => (
                <div key={actor.id} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {actor.image && !actor.broken ? (
                      <img
                        src={actor.image}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={() => updateActor(actor.id, "broken", true)}
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-stone-400">
                        {initials(actor.name)}
                      </span>
                    )}
                  </div>
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={actor.name}
                      onChange={(e) =>
                        updateActor(actor.id, "name", e.target.value)
                      }
                      placeholder="Actor name"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={actor.image}
                      onChange={(e) =>
                        updateActor(actor.id, "image", e.target.value)
                      }
                      placeholder="Actor image URL"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeActor(actor.id)}
                    className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Remove actor"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {cast.length === 0 && (
                <p className="text-xs text-stone-500">
                  No cast members yet — add one above.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <span className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-bold text-stone-400 hover:text-stone-200">
              Cancel
            </span>
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-red-900 px-6 py-2.5 text-sm font-extrabold tracking-wide text-stone-50 shadow-lg shadow-red-950/50 transition-all hover:-translate-y-0.5 hover:bg-red-800"
            >
              Create Movie
            </button>
          </div>
        </div>

        {/* ───────────────────── LIVE PREVIEW ───────────────────── */}
        <aside className="w-full flex-shrink-0 lg:sticky lg:top-8 lg:w-[340px]">
          <p className="mb-3 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-stone-500">
            <Clapperboard className="h-3.5 w-3.5" />
            Live Preview
          </p>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40">
            {/* Backdrop */}
            <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
              {backdropUrl && !backdropBroken ? (
                <img
                  src={backdropUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setBackdropBroken(true)}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-stone-600">
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">
                    Backdrop
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

              {trailerId && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailerId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-stone-100 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </a>
              )}

              {/* Poster overlapping the backdrop */}
              <div className="absolute -bottom-14 left-4 h-28 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 border-zinc-950 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-lg">
                {posterUrl && !posterBroken ? (
                  <img
                    src={posterUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setPosterBroken(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-stone-600">
                    <Film className="h-5 w-5" />
                  </div>
                )}
              </div>

              {rating && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-bold text-stone-100">
                    {rating}
                  </span>
                </div>
              )}
            </div>

            <div className="px-4 pb-5 pt-16">
              <h3 className="font-display text-2xl leading-tight tracking-wide text-stone-100">
                {title || (
                  <span className="text-stone-600">Untitled movie</span>
                )}
              </h3>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-stone-400">
                <span className="rounded border border-stone-600 px-1.5 py-0.5 text-[10px] font-bold text-stone-300">
                  {ageRating}
                </span>
                {duration && <span>{duration}</span>}
                {releaseDate && (
                  <>
                    <span className="text-stone-600">•</span>
                    <span>{releaseDate}</span>
                  </>
                )}
                <span className="text-stone-600">•</span>
                <span className="rounded bg-red-900/60 px-1.5 py-0.5 text-[10px] font-bold uppercase text-stone-200">
                  {format}
                </span>
              </div>

              {description && (
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-stone-400">
                  {description}
                </p>
              )}

              {(director || studio) && (
                <p className="mt-3 text-[11px] text-stone-500">
                  {director && (
                    <>
                      Directed by{" "}
                      <span className="font-semibold text-stone-300">
                        {director}
                      </span>
                    </>
                  )}
                  {director && studio && " · "}
                  {studio && (
                    <span className="font-semibold text-stone-300">
                      {studio}
                    </span>
                  )}
                </p>
              )}

              {genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-400"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {filledCast.length > 0 && (
                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Cast
                  </p>
                  <div className="flex -space-x-2">
                    {filledCast.slice(0, 6).map((a) => (
                      <div
                        key={a.id}
                        title={a.name}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-950 bg-white/10"
                      >
                        {a.image && !a.broken ? (
                          <img
                            src={a.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] font-bold text-stone-300">
                            {initials(a.name)}
                          </span>
                        )}
                      </div>
                    ))}
                    {filledCast.length > 6 && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-zinc-950 bg-white/10 text-[9px] font-bold text-stone-300">
                        +{filledCast.length - 6}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 text-center text-[10.5px] text-stone-600">
            This is roughly how the tile will look in the catalog.
          </p>
        </aside>
      </div>
    </div>
  );
}
