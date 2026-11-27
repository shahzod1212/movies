import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Armchair,
  CreditCard,
  Mail,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooking, fetchMyBookingByStatus } from "../redux/bookingSlice";
import { Link } from "react-router-dom";

const STATUS_TABS = ["ALL", "PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"];

const STATUS_STYLES = {
  PENDING: "bg-amber-400/15 text-amber-400",
  CONFIRMED: "bg-emerald-400/15 text-emerald-400",
  CANCELLED: "bg-stone-600/30 text-stone-400",
  EXPIRED: "bg-red-500/15 text-red-400",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateTimeStr) {
  const d = new Date(dateTimeStr);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BookingCard({ booking }) {
  const isPending = booking.status === "PENDING";
  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#2b0a0f] via-[#1c0810] to-[#120509] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30">
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-2xl leading-tight tracking-wide text-stone-50">
                {booking.movieTitle}
              </p>
              <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-wider text-stone-500">
                Booking #{String(booking.id).padStart(6, "0")}
              </p>
            </div>
            <span
              className={`flex-shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[booking.status]}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              {formatDate(booking.showDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              {booking.roomName}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              Booked {formatTime(booking.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Armchair className="h-3.5 w-3.5 text-amber-400" />
            <div className="flex flex-wrap gap-1.5">
              {booking.seats.map((seat) => (
                <span
                  key={seat.id}
                  className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold text-stone-200"
                >
                  {seat.rowLabel}
                  {seat.seatNumber}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex flex-shrink-0 flex-row items-center justify-between gap-3 border-t border-dashed border-white/10 p-5 sm:w-52 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0">
          <div className="pointer-events-none absolute -left-2.5 -top-2.5 hidden h-5 w-5 rounded-full bg-zinc-950 sm:block" />
          <div className="pointer-events-none absolute -bottom-2.5 -left-2.5 hidden h-5 w-5 rounded-full bg-zinc-950 sm:block" />
          <div className="sm:text-right">
            <p className="text-[10px] uppercase tracking-wider text-stone-500">
              Total paid
            </p>
            <p className="font-display text-2xl text-amber-400">
              ${booking.totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:w-full">
            {isPending && (
              <button
                onClick={() =>
                  (window.location.href = booking.checkoutSessionId)
                }
                className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-[11px] font-bold text-zinc-950 shadow-lg shadow-amber-400/30 transition-all group-hover:-translate-y-0.5 group-hover:bg-amber-300 sm:w-full"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Pay Now
              </button>
            )}
            {isConfirmed && (
              <div className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3.5 py-2 text-center sm:w-full">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                <span className="text-[10.5px] font-bold uppercase tracking-wide text-amber-300">
                  Emailed to you
                </span>
              </div>
            )}
            <Link
              to={`/showtime/${booking.showtimeId}`}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-red-900 px-3.5 py-2 text-[11px] font-bold text-stone-50 shadow-lg shadow-red-950/50 transition-all group-hover:-translate-y-0.5 group-hover:bg-red-800 sm:w-full"
            >
              <Ticket className="h-3.5 w-3.5" />
              View showtime
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const BookingPage = () => {
  const bookings = useSelector((state) => state.booking.bookings);
  const filteredBookings = useSelector(
    (state) => state.booking.filteredBookings,
  );
  const dispatch = useDispatch();
  const [folder, setFolder] = useState("ALL");
  const [filteredOpen, setFilteredOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBooking());
  }, [dispatch]);

  useEffect(() => {
    if (folder === "ALL") {
      setFilteredOpen(false);
      return;
    }
    setFilteredOpen(true);
    dispatch(fetchMyBookingByStatus(folder));
  }, [folder]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar />

      <div className="flex-1 px-5 sm:px-10 pt-24 sm:pt-28 pb-16">
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-stone-100">
          My Bookings
        </h1>
        <p className="mt-1 text-xs text-stone-400">
          Every ticket you have booked, past and upcoming.
        </p>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => (
            <span
              key={tab}
              onClick={() => setFolder(tab)}
              className={`flex-shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                folder === tab
                  ? "bg-amber-400 text-zinc-950"
                  : "bg-white/5 text-stone-300 hover:bg-white/10"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(filteredOpen ? filteredBookings : bookings).map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
