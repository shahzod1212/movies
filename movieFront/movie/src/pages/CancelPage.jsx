import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { XCircle, Home, RotateCcw, Ticket, ShieldCheck } from "lucide-react";

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-5 py-12 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }

        @keyframes popIn {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pop-in { animation: popIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        @keyframes ringPulse {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          70% { box-shadow: 0 0 0 22px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        .ring-pulse { animation: ringPulse 2s ease-out infinite; }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(7deg); }
          60% { transform: rotate(-5deg); }
          80% { transform: rotate(3deg); }
        }
        .shake-once { animation: shake 0.6s ease-in-out 0.4s both; }
      `}</style>

      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-zinc-700/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="pop-in flex flex-col items-center">
          <div className="ring-pulse mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/40">
            <XCircle className="shake-once h-11 w-11 text-red-500" />
          </div>

          <h1 className="text-center font-display text-4xl tracking-wide text-white">
            Checkout Cancelled
          </h1>
          <p className="mt-2 max-w-sm text-center text-sm text-stone-400">
            Your payment was cancelled before it was completed. No worries —
            your seats haven't been charged.
          </p>

          <div className="mt-8 flex w-full items-center gap-3 rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
              <ShieldCheck className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">No charge was made</p>
              <p className="text-xs text-stone-500">
                Your card was not billed for this booking.
              </p>
            </div>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <Link
              to="/showtimes"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20"
            >
              <Ticket className="h-4 w-4" />
              Browse Showtimes
            </Link>
            <button
              onClick={() => navigate(-2)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-700 to-orange-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>

          <Link
            to="/home"
            className="mt-5 flex items-center gap-1.5 text-xs text-stone-500 transition-colors hover:text-stone-300"
          >
            <Home className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
