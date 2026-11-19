import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Hash } from "lucide-react";
import Navbar from "../components/Navbar";
import BrowseCard from "../components/BrowserCard";
import { useNavigate } from "react-router-dom";
import {
  fetchMoviesByGenresIn,
  fetchSearchMoviesByTitle,
  fetchMoviesByStudio,
  fetchMoviesByLanguage,
  fetchMoviesByMinRating,
  setKeyword,
} from "../redux/movieSlice";

const GENRES = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Adventure",
  "Animation",
  "Thriller",
];

const RATINGS = [5, 6, 7, 8, 9];

const MoviePage = () => {
  const movies = useSelector((state) => state.movie.movies);
  const filteredMovie = useSelector((state) => state.movie.filteredMovie);
  const keyword = useSelector((state) => state.movie.keyword);
  const count = useSelector((state) => state.movie.count);
  const [filteredOpen, setFilteredOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchCategory, setSearchCategory] = useState("title");
  const [selectedRating, setSelectedRating] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleGenres(genre) {
    if (genre === "All") {
      setFilteredOpen(false);
      setSelectedGenres([]);
      return;
    }

    const alreadySelected = selectedGenres.includes(genre);
    const updatedGenres = alreadySelected
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(updatedGenres);

    if (updatedGenres.length === 0) {
      setFilteredOpen(false);
      return;
    }

    setFilteredOpen(true);
    dispatch(
      fetchMoviesByGenresIn({ genres: updatedGenres, page: 0, size: 20 }),
    );
  }

  function handleRatingSelect(rating) {
    if (selectedRating === rating) {
      setSelectedRating(null);
      setFilteredOpen(false);
      return;
    }

    setSelectedRating(rating);
    setFilteredOpen(true);
    dispatch(fetchMoviesByMinRating({ minRating: rating, page: 0, size: 20 }));
  }

  useEffect(() => {
    if (!keyword) {
      setFilteredOpen(false);
      return;
    }

    const timeout = setTimeout(() => {
      if (searchCategory === "title") {
        dispatch(
          fetchSearchMoviesByTitle({ title: keyword, page: 0, size: 20 }),
        );
      } else if (searchCategory === "studio") {
        dispatch(fetchMoviesByStudio({ studio: keyword, page: 0, size: 20 }));
      } else if (searchCategory === "language") {
        dispatch(
          fetchMoviesByLanguage({ language: keyword, page: 0, size: 20 }),
        );
      }
      setFilteredOpen(true);
    }, 400);

    return () => clearTimeout(timeout);
  }, [dispatch, keyword, searchCategory]);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar />

      <div id="header" className="px-5 sm:px-10 pt-24 sm:pt-28 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-stone-100">
              All Movies
            </h1>
            <p className="mt-1 text-xs text-stone-400">
              Browse everything currently playing and coming soon.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3.5 py-2 ring-1 ring-white/10">
            <Hash className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-stone-400">Matches</span>
            <span className="font-display text-lg leading-none text-amber-400">
              {count}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex flex-1 items-center sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-stone-500" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => dispatch(setKeyword(e.target.value))}
              placeholder={`Search by ${searchCategory}...`}
              className="w-full rounded-lg border border-stone-700 bg-white/5 py-2.5 pl-10 pr-3.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition-colors focus:border-amber-400 focus:bg-amber-400/5"
            />
          </div>

          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="rounded-lg border border-stone-700 bg-white/5 py-2.5 px-3 text-sm text-stone-100 outline-none transition-colors focus:border-amber-400"
          >
            <option value="title" className="bg-zinc-900">
              Title
            </option>
            <option value="studio" className="bg-zinc-900">
              Studio
            </option>
            <option value="language" className="bg-zinc-900">
              Language
            </option>
          </select>
        </div>

        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {GENRES.map((genre) => {
            const isActive =
              genre === "All"
                ? selectedGenres.length === 0
                : selectedGenres.includes(genre);

            return (
              <button
                key={genre}
                onClick={() => handleGenres(genre)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-amber-400 text-zinc-950"
                    : "bg-white/5 text-stone-300 hover:bg-white/10 hover:text-stone-100"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {(filteredOpen ? filteredMovie : movies).map((movie) => (
            <BrowseCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
