import React, { useState, useEffect, useMemo } from "react";
import { Mail, Lock, Eye, EyeOff, Clapperboard } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLoginUser } from "../redux/userSlice";

const POSTER_URLS = [
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2hGU-j7PV3S0Ndk6vGdzTyySY3-w6hx93D2flZ6gTiQ&s=10",
    title: "Avengers: Doomsday",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMooRgthraaB2RBmCvU2ymyHuxyGT5BGvdSeo_A2g23w&s=10",
    title: "Housemaid",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyDdl0dgP76XAix3mZxOtMkvibn4_cmkzMeM4GHAGJ2Q&s",
    title: "Devil Wears Prada 2",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCLGg32mAUdQAp0MRlVdcKKojg164O6dWJJU6VFyN-dw&s",
    title: "Spider-Man: Brand New Day",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5RHDZxtaz1u6631vbBrP_GEpzPjOzCPPEUGzr6-84EA&s",
    title: "Bad Boys",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUBLwWUNo-PeGAZloaJ17CJfSCSPM_kULeYMi-2JOEcw&s=10",
    title: "Ballerina",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrIRhGRJXW4lCg29gc1t_DtHzXEuV0u9J8YRErnSimIg&s=10",
    title: "Hoopers",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4dSEdJtvOY_imXghnKseTyc33imNUE_SIu_XCq59TUg&s=10",
    title: "The Odyssey",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWasu5PQBigoOdmzaws0RpvNbKxNdU8J5qI-3j8aoyZQ&s=10",
    title: "Moana 2",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYKSIJ6Q1MFdNH8IreFghWJK_RnRg8CjHxU4rKZsOMYw&s=10",
    title: "Transformers: The Last Knight",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT67fB8_oVvFJgGeBXEzkmcDInNPZs4k1s_bNyxQEA_xw&s=10",
    title: "The Expendables 4",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh6EqYhVOTPgzgnkVlP5h9p940gLq87TrsJueemYNZ_w&s=10",
    title: "Barbie",
  },
];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function PosterTile({ poster, index, isSpotlit }) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={`poster-tile group relative overflow-hidden rounded-md opacity-0 ${
        isSpotlit ? "ring-2 ring-amber-400" : "ring-1 ring-white/5"
      } transition-[box-shadow] duration-700`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {!broken ? (
        <img
          src={poster.src}
          alt={poster.title || "Movie poster"}
          onError={() => setBroken(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          draggable={false}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-red-950 to-zinc-900" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/10 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

      {isSpotlit && (
        <div className="pointer-events-none absolute inset-0 bg-amber-400/10 mix-blend-overlay" />
      )}

      {poster.title && (
        <span className="pointer-events-none absolute bottom-1.5 left-2 translate-y-2 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {poster.title}
        </span>
      )}
    </div>
  );
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const posters = useMemo(() => shuffle(POSTER_URLS), []);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotlightIndex((i) => (i + 1) % posters.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [posters.length]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setFormError("Please fill in both fields to continue.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setFormError("Please enter a valid Gmail address.");
      return;
    }

    setFormError("");

    try {
      await dispatch(fetchLoginUser({ email, password })).unwrap();
      navigate("/home");
    } catch (err) {}
  }

  return (
    <div
      className={`flex h-dvh max-h-dvh w-full overflow-hidden bg-zinc-950 font-sans transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');

        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }

        .poster-tile {
          animation: tileIn 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }
        @keyframes tileIn {
          from { opacity: 0; transform: scale(0.94) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="relative hidden sm:grid flex-[1.4] min-w-0 grid-cols-3 md:grid-cols-4 grid-rows-3 gap-1 p-1 bg-red-950"
        aria-hidden="true"
      >
        {posters.map((p, i) => (
          <PosterTile
            key={p.src}
            poster={p}
            index={i}
            isSpotlit={i === spotlightIndex}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_40%,rgba(9,9,11,0.7)_100%)]" />
      </div>

      <div
        className="hidden sm:flex w-6 md:w-7 flex-shrink-0 flex-col items-center justify-evenly bg-black py-3"
        aria-hidden="true"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-sm bg-zinc-950 ring-1 ring-inset ring-amber-400/20"
          />
        ))}
      </div>

      <div className="flex flex-1 min-w-0 sm:min-w-[340px] sm:max-w-sm flex-col justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-5 sm:px-8 py-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-900">
            <Clapperboard className="h-3.5 w-3.5 text-amber-300" />
          </span>
          <span className="font-display text-lg tracking-widest text-amber-400">
            CINEMAX
          </span>
        </div>

        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">
          Welcome back
        </p>
        <h1 className="font-display mb-2 text-2xl sm:text-3xl md:text-4xl leading-none tracking-wide text-stone-100">
          Take your <span className="text-amber-400">seat again.</span>
        </h1>
        <p className="mb-5 max-w-[36ch] text-xs text-stone-400">
          Sign in to manage your bookings and grab your next tickets.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-400"
            >
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="pointer-events-none absolute left-3 h-4 w-4 text-stone-500" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-stone-100 placeholder-stone-500 outline-none transition-colors focus:border-amber-400 focus:bg-amber-400/5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-400"
              >
                Password
              </label>
              <a
                href="#"
                className="text-[10.5px] font-semibold text-amber-400 hover:text-amber-300"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock className="pointer-events-none absolute left-3 h-4 w-4 text-stone-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-white/5 py-2.5 pl-9 pr-9 text-sm text-stone-100 placeholder-stone-500 outline-none transition-colors focus:border-amber-400 focus:bg-amber-400/5"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 flex p-1 text-stone-500 transition-colors hover:text-amber-400"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {formError && (
            <p className="text-xs font-semibold text-red-400">{formError}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-red-900 py-2.5 text-sm font-extrabold tracking-wide text-stone-50 shadow-lg shadow-red-950/60 transition-all hover:-translate-y-0.5 hover:bg-red-800 active:translate-y-0 active:bg-red-950"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-stone-400">
          New here?{" "}
          <a href="#" className="font-bold text-amber-400 hover:text-amber-300">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
