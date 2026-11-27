import React from "react";
import {
  Clapperboard,
  LayoutDashboard,
  Film,
  DoorOpen,
  CalendarClock,
  PlayCircle,
  Ticket,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Create Movie", icon: Film },
  { label: "Create Room", icon: DoorOpen },
  { label: "Create Showtime", icon: CalendarClock },
  { label: "Now Playing", icon: PlayCircle },
];

export default function AdminSidebar({ activeView, onSelect }) {
  const user = useSelector((state) => state.user.user);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/5 bg-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-900">
          <Clapperboard className="h-4 w-4 text-amber-300" />
        </span>
        <div>
          <p className="font-display text-lg leading-none tracking-widest text-amber-400">
            CINEMAX
          </p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-stone-500">
            Admin Panel
          </p>
        </div>
      </div>

      <div className="px-3 pb-2">
        <Link
          to="/home"
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm font-semibold text-stone-300 transition-colors hover:bg-white/5 hover:text-stone-100"
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-stone-600">
          Manage
        </p>
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = activeView === label;

            return (
              <div
                key={label}
                onClick={() => onSelect(label)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-red-900 text-stone-50 shadow-lg shadow-red-950/40"
                    : "text-stone-400 hover:bg-white/5 hover:text-stone-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/5 px-3 py-4">
        <div
          title="Settings are not available yet"
          aria-disabled="true"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-600"
        >
          <Settings className="h-4 w-4" />
          Settings (coming soon)
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-zinc-950">
            {user?.username.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-stone-200">
              {user?.username.toUpperCase()}
            </p>
            <p className="truncate text-[10px] text-stone-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
