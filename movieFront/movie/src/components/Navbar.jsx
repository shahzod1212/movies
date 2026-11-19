import React, { useEffect, useRef, useState } from "react";
import { Clapperboard, LogOut, Mail, Shield, CalendarDays } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../redux/userSlice";

const links = [
  { name: "Home", path: "/home" },
  { name: "Movies", path: "/movies" },
  { name: "Now Playing", path: "/showtimes" },
  { name: "My Bookings", path: "/bookings" },
];

function formatJoinedDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Navbar() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 sm:px-10 py-4 bg-gradient-to-b from-black/70 to-transparent">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-900">
          <Clapperboard className="h-4 w-4 text-red-300" />
        </span>
        <span className="font-display text-xl tracking-widest text-red-500">
          CINEMAX
        </span>
      </div>

      <nav className="hidden sm:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-300">
        {links.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <a
              key={item.name}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={`text-gray-500 ${isActive ? "text-red-600" : "hover:text-white/50"}`}
            >
              {item.name}
            </a>
          );
        })}
      </nav>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-800 text-xs font-bold text-stone-200 cursor-pointer transition-transform hover:scale-105 ring-2 ring-transparent hover:ring-red-500/40"
        >
          {user?.username?.slice(0, 1).toUpperCase()}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c0810] via-[#170710] to-[#0e0509] shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-800 text-sm font-bold text-stone-100 ring-2 ring-red-500/30">
                {user?.username?.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-lg tracking-wide text-stone-50">
                  {user?.username}
                </p>
                {user?.role && (
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <Shield className="h-2.5 w-2.5" />
                    {user.role}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 px-4 py-3 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                <span className="truncate">{user?.email}</span>
              </div>
              {user?.createdAt && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                  <span>Joined {formatJoinedDate(user.createdAt)}</span>
                </div>
              )}
            </div>

            <div className="p-3 pt-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-900 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-50 shadow-lg shadow-red-950/50 transition-all hover:-translate-y-0.5 hover:bg-red-800"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
