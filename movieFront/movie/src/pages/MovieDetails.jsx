import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  Film,
  Globe,
  MapPin,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { fetchMovieById } from "../redux/movieSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoCard from "../components/VideoCard";

export default function MovieDetails() {
  const selectedMovie = useSelector((state) => state.movie.selectedMovie);
  const status = useSelector((state) => state.movie.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedMovie) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [selectedMovie]);

  if (status === "loading" && !selectedMovie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-sm text-red-400">Loading movie…</p>
      </div>
    );
  }

  if (!selectedMovie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-sm text-red-400">Movie not found.</p>
      </div>
    );
  }

  const movie = selectedMovie;
  const actorEntries = movie.actors ? Object.entries(movie.actors) : [];

  return (
    <div className="min-h-screen bg-zinc-950 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
      `}</style>

      <Navbar />

      <section id="header" className="relative h-screen w-full overflow-hidden">
        <img
          src={movie.backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/60 via-black/10 to-transparent" />

        <button
          onClick={() =>
            navigate(location.key === "default" ? "/movies" : -1)
          }
          className="absolute left-5 top-6 z-20 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400/80 transition-colors hover:text-red-300 sm:left-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <div className="relative z-10 flex h-full items-end px-5 pb-16 sm:px-10">
          <div className="max-w-xl">
            {movie.genres?.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-red-950/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300 backdrop-blur-sm ring-1 ring-red-800/40"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display text-5xl leading-none tracking-wide text-white sm:text-7xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-red-300">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-red-500 text-red-500" />
                <span className="font-bold text-red-300">{movie.rating}</span>
                {movie.originalRating != null && (
                  <span className="text-xs text-red-500/70">
                    (orig. {movie.originalRating})
                  </span>
                )}
              </span>
              {movie.durationTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {movie.durationTime}
                </span>
              )}
              {movie.ageRating && (
                <span className="rounded border border-red-800 px-1.5 py-0.5 text-[10px] font-bold text-red-300">
                  {movie.ageRating}
                </span>
              )}
            </div>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white">
              {movie.description}
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

      {movie.trailerUrl && (
        <section className="px-5 py-10 sm:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="sm:w-1/3">
                <h2 className="font-display text-2xl tracking-wide text-red-500">
                  Trailer
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white">
                  {movie.description}
                </p>
              </div>
              <div className="sm:w-2/3">
                <VideoCard videoId={movie.trailerUrl} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-5 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 font-display text-2xl tracking-wide text-red-500">
            Details
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <DetailCard
              icon={Calendar}
              label="Release Date"
              value={movie.releaseDate}
            />
            <DetailCard icon={Globe} label="Language" value={movie.language} />
            <DetailCard icon={Film} label="Director" value={movie.director} />
            <DetailCard icon={Building2} label="Studio" value={movie.studio} />
            <DetailCard
              icon={MapPin}
              label="Filming Location"
              value={movie.filmingLocation}
            />
            <DetailCard
              icon={Film}
              label="Formats"
              value={movie.formats?.join(", ")}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-xl bg-red-950/20 p-4 ring-1 ring-red-900/40">
      <Icon className="h-4 w-4 text-red-500" />
      <p className="mt-2 text-[10px] uppercase tracking-wider text-red-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
    </div>
  );
}
