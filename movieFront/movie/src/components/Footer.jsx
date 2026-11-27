import React from "react";
import {
  Clapperboard,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-red-950/40 bg-zinc-950 px-5 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Clapperboard className="h-5 w-5 text-red-500" />
              <span className="font-display text-xl tracking-wide text-stone-50">
                CineHub
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-500">
              Book your seats, pick your showtime, enjoy the movie.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-xs text-stone-500">
              <li>
                <Link
                  to="/showtimes"
                  className="transition-colors hover:text-red-500"
                >
                  Now Showing
                </Link>
              </li>
              <li>
                <Link
                  to="/home#rooms"
                  className="transition-colors hover:text-red-500"
                >
                  Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/showtimes"
                  className="transition-colors hover:text-red-500"
                >
                  Showtimes
                </Link>
              </li>
              <li>
                <Link
                  to="/movies"
                  className="transition-colors hover:text-red-500"
                >
                  Browse All
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">
              Contact
            </p>
            <ul className="mt-3 space-y-2 text-xs text-stone-500">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-red-800" />
                123 Cinema Ave, City
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-red-800" />
                +1 (555) 010-0101
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-red-800" />
                hello@cinehub.com
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">
              Follow
            </p>
            <p className="mt-3 text-xs text-stone-500">Social links coming soon.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-red-950/40 pt-6 sm:flex-row">
          <p className="text-[10px] text-stone-600">
            © {new Date().getFullYear()} CineHub. All rights reserved.
          </p>
          <p className="text-[10px] text-stone-600">Built for movie lovers.</p>
        </div>
      </div>
    </footer>
  );
}
