import React, { useState, useEffect, useMemo } from "react";
import { Star, Clock, Ticket } from "lucide-react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import RoomCard from "../components/RoomCard";
import BrowseCard from "../components/BrowserCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovies } from "../redux/movieSlice";
import { fetchAllRoomsStore } from "../redux/roomSlice";
import { fetchAllShowtime } from "../redux/showtimeSlice";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movies = useSelector((state) => state.movie.movies);
  const token = useSelector((state) => state.user.token);
  const rooms = useSelector((state) => state.room.rooms);
  const showtimes = useSelector((state) => state.showtime.showtimes);
  const featured = useMemo(() => movies.slice(0, 4), [movies]);
  const previewMovies = useMemo(() => movies.slice(0, 5), [movies]);
  const hero = featured[heroIndex];
  const heroShowtime = showtimes.find(
    (showtime) => showtime.movie?.id === hero?.id,
  );

  useEffect(() => {
    if (!token) return;

    dispatch(fetchAllMovies({ page: 0, size: 20 }));
    dispatch(fetchAllRoomsStore());
    dispatch(fetchAllShowtime());

    const interval = setInterval(() => {
      dispatch(fetchAllMovies({ page: 0, size: 20 }));
      dispatch(fetchAllRoomsStore());
      dispatch(fetchAllShowtime());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, token]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (featured.length === 0) return;

    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % featured.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [featured.length]);

  return (
    <div
      className={`min-h-screen bg-zinc-950 font-sans transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar />

      {hero ? (
        <section className="relative h-[68vh] min-h-[420px] w-full overflow-hidden">
          {featured.map((movie, i) => (
            <img
              key={movie.id}
              src={movie.backdropUrl}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === heroIndex ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />

          <div className="relative z-10 flex h-full max-w-3xl flex-col justify-end px-5 sm:px-10 pb-14">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {hero.genres?.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-200 backdrop-blur-sm"
                >
                  {g}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl sm:text-6xl leading-none tracking-wide text-stone-50">
              {hero.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-xs text-stone-300">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-stone-100">{hero.rating}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {hero.durationTime}
              </span>
              <span className="rounded border border-stone-500 px-1.5 py-0.5 text-[10px] font-bold">
                {hero.ageRating}
              </span>
            </div>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-300">
              {hero.description}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() =>
                  navigate(
                    heroShowtime
                      ? `/showtime/${heroShowtime.id}`
                      : "/showtimes",
                  )
                }
                className="flex items-center gap-2 rounded-lg bg-red-900 px-6 py-3 text-sm font-extrabold tracking-wide text-stone-50 shadow-lg shadow-red-950/60 transition-all hover:-translate-y-0.5 hover:bg-red-800"
              >
                <Ticket className="h-4 w-4" />
                Book tickets
              </button>
              <div className="flex items-center gap-1.5">
                {featured.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === heroIndex ? "w-6 bg-amber-400" : "w-1.5 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex h-[68vh] min-h-[420px] w-full items-center justify-center bg-zinc-950">
          <p className="text-sm text-stone-500">Loading featured movies…</p>
        </section>
      )}

      <section className="px-5 sm:px-10 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide text-stone-100">
            Now Showing
          </h2>
          <Link
            to="/showtimes"
            className="text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300"
          >
            See all →
          </Link>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {showtimes.map((showtime) => (
            <MovieCard key={showtime.id} showtime={showtime} />
          ))}
        </div>
      </section>

      <section id="rooms" className="px-5 sm:px-10 py-10">
        <div className="mb-5">
          <h2 className="font-display text-2xl tracking-wide text-stone-100">
            Our Rooms
          </h2>
          <p className="mt-1 text-xs text-stone-400">
            Every room has its own sound, seating, and price tiers.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-10 py-10 pb-16">
        <div className="mb-5">
          <h2 className="font-display text-2xl tracking-wide text-stone-100">
            Browse All Movies
          </h2>
          <p className="mt-1 text-xs text-stone-400">
            The full collection, from new releases to classics.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {previewMovies.map((movie) => (
            <BrowseCard key={movie.id} movie={movie} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/movies")}
            className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-amber-400 transition-all hover:-translate-y-0.5 hover:bg-amber-400/20"
          >
            See all movies
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
