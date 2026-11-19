import React from "react";
import {
  Clapperboard,
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  AtSign,
  Send,
} from "lucide-react";

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
              <li className="cursor-pointer transition-colors hover:text-red-500">
                Now Showing
              </li>
              <li className="cursor-pointer transition-colors hover:text-red-500">
                Rooms
              </li>
              <li className="cursor-pointer transition-colors hover:text-red-500">
                Showtimes
              </li>
              <li className="cursor-pointer transition-colors hover:text-red-500">
                Browse All
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
            <div className="mt-3 flex gap-3">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-stone-500 ring-1 ring-red-900/40 transition-colors hover:text-red-500"
              >
                <LinkIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-stone-500 ring-1 ring-red-900/40 transition-colors hover:text-red-500"
              >
                <AtSign className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-stone-500 ring-1 ring-red-900/40 transition-colors hover:text-red-500"
              >
                <Send className="h-3.5 w-3.5" />
              </a>
            </div>
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
