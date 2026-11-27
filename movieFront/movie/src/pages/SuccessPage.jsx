import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Ticket,
  Calendar,
  Clock,
  DoorOpen,
  MapPin,
  Home,
  Film,
} from "lucide-react";
import { get } from "idb-keyval";
import api from "../axios/axios";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("loading");
  const [booking, setBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function confirm() {
      if (!sessionId) {
        setStatus("error");
        setErrorMsg("No checkout session was found.");
        return;
      }

      try {
        const token = await get("token");

        if (!token) {
          setStatus("error");
          setErrorMsg(
            "You're not logged in. Please log in to view your booking.",
          );
          return;
        }

        const response = await api.post("/api/bookings/confirm", null, {
          params: { sessionId },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setBooking(response.data);
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg("We couldn't confirm your payment.");
        }
      } catch (err) {
        console.error(
          "confirmBookingPayment failed:",
          err.response?.status,
          err.response?.data,
        );
        setStatus("error");
        setErrorMsg(
          err?.response?.data?.message ||
            (typeof err?.response?.data === "string"
              ? err.response.data
              : null) ||
            "Something went wrong while confirming your booking.",
        );
      }
    }

    confirm();
  }, [sessionId]);

  const seatLabels =
    booking?.seats?.map((s) => `${s.rowLabel}${s.seatNumber}`).join(", ") || "";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-5 py-12 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }

        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          bottom: 0;
          animation: floatUp linear infinite;
        }

        @keyframes popIn {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pop-in { animation: popIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        @keyframes ringPulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
          70% { box-shadow: 0 0 0 22px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .ring-pulse { animation: ringPulse 2s ease-out infinite; }

        .ticket-notch::before,
        .ticket-notch::after {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          background: #09090b;
          border-radius: 9999px;
          z-index: 10;
        }
        .ticket-notch::before { left: -12px; }
        .ticket-notch::after { right: -12px; }
      `}</style>

      {status === "success" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => {
            const colors = [
              "#f87171",
              "#fb923c",
              "#facc15",
              "#4ade80",
              "#60a5fa",
              "#c084fc",
            ];
            const left = Math.random() * 100;
            const delay = Math.random() * 4;
            const duration = 4 + Math.random() * 4;
            const size = 6 + Math.random() * 6;
            const color = colors[i % colors.length];
            return (
              <span
                key={i}
                className="confetti-piece rounded-sm"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size * 1.6,
                  backgroundColor: color,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {status === "loading" && (
          <div className="pop-in flex flex-col items-center rounded-3xl bg-zinc-900 p-10 text-center ring-1 ring-white/10">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-red-500" />
              <Film className="absolute h-6 w-6 text-red-300" />
            </div>
            <h1 className="mt-6 font-display text-2xl tracking-wide text-white">
              Confirming your payment…
            </h1>
            <p className="mt-2 text-sm text-stone-400">
              Hang tight, we're locking in your seats.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="pop-in flex flex-col items-center rounded-3xl bg-zinc-900 p-10 text-center ring-1 ring-red-900/40">
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="mt-6 font-display text-2xl tracking-wide text-white">
              Payment Not Confirmed
            </h1>
            <p className="mt-2 text-sm text-stone-400">{errorMsg}</p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/home")}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20"
              >
                <Home className="h-4 w-4" />
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-700 to-orange-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="pop-in flex flex-col items-center">
            <div className="ring-pulse mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/40">
              <CheckCircle2 className="h-11 w-11 text-green-400" />
            </div>

            <h1 className="text-center font-display text-4xl tracking-wide text-white">
              You're All Set!
            </h1>
            <p className="mt-2 text-center text-sm text-stone-400">
              Your payment went through and your seats are booked.
            </p>

            <div className="relative mt-8 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-900 ring-1 ring-red-900/40">
              <div className="ticket-notch relative flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                  <Ticket className="h-6 w-6 text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl tracking-wide text-white">
                    {booking?.showtime?.movie?.title || "Your Movie"}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-red-400">
                    Booking #
                    {booking?.id
                      ? String(booking.id).padStart(6, "0")
                      : "------"}
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-red-900/40" />

              <div className="grid grid-cols-2 gap-4 p-6">
                <InfoRow
                  icon={Calendar}
                  label="Date"
                  value={booking?.showtime?.date}
                />
                <InfoRow
                  icon={Clock}
                  label="Time"
                  value={booking?.showtime?.startTime}
                />
                <InfoRow
                  icon={DoorOpen}
                  label="Room"
                  value={booking?.showtime?.room?.name}
                />
                <InfoRow icon={MapPin} label="Seats" value={seatLabels} />
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-red-900/40 px-6 py-4">
                <span className="text-[10px] uppercase tracking-wider text-stone-500">
                  Total Paid
                </span>
                <span className="font-display text-2xl tracking-wide text-white">
                  ${booking?.totalAmount?.toFixed(2) ?? "0.00"}
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-stone-500">
              A confirmation email with your ticket PDF is on its way to your
              inbox.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <Link
                to="/bookings"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20"
              >
                <Ticket className="h-4 w-4" />
                My Bookings
              </Link>
              <Link
                to="/home"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-700 to-orange-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02]"
              >
                <Home className="h-4 w-4" />
                Back Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-red-400">
          {label}
        </p>
        <p className="truncate text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export default SuccessPage;
