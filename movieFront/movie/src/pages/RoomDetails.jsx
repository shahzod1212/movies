import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Users, Volume2, Monitor, Clapperboard, ArrowLeft } from "lucide-react";
import { fetchRoomById } from "../redux/roomSlice";
import { fetchSeatsByRoom } from "../redux/seatSlice";
import SeatMap from "../components/SeatMap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ACCENT_BY_TYPE = {
  IMAX: "from-red-900 to-red-950",
  STANDARD: "from-zinc-800 to-zinc-950",
  VIP: "from-red-800 to-red-950",
};
const DEFAULT_ACCENT = "from-zinc-800 to-zinc-950";

export default function RoomDetails() {
  const roomDetail = useSelector((state) => state.room.selectedRoom);
  const seats = useSelector((state) => state.seat.seats);
  const roomStatus = useSelector((state) => state.room.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchRoomById(id));
      dispatch(fetchSeatsByRoom(id));
    }
  }, [dispatch, id]);

  if (roomStatus === "loading" && !roomDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-sm text-red-400">Loading room…</p>
      </div>
    );
  }

  if (!roomDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-sm text-red-400">Room not found.</p>
      </div>
    );
  }

  const accent = ACCENT_BY_TYPE[roomDetail.roomType] ?? DEFAULT_ACCENT;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
      `}</style>

      <Navbar />

      <section
        className={`relative overflow-hidden bg-gradient-to-br ${accent} px-5 py-14 sm:px-10`}
      >
        <div className="pointer-events-none absolute inset-0 bg-black/20" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <button
            onClick={() =>
              navigate(location.key === "default" ? "/home#rooms" : -1)
            }
            className="mb-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <span className="rounded-full bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-400">
            {roomDetail.roomType}
          </span>

          <h1 className="mt-3 font-display text-5xl leading-none tracking-wide text-white sm:text-6xl">
            {roomDetail.name}
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={Users}
              label="Total Seats"
              value={roomDetail.totalSeats}
            />
            <StatCard
              icon={Volume2}
              label="Sound"
              value={roomDetail.soundSystem?.replaceAll("_", " ")}
            />
            <StatCard
              icon={Monitor}
              label="Screen"
              value={`${roomDetail.screenSize} · ${roomDetail.screenPosition}`}
            />
            <StatCard
              icon={Clapperboard}
              label="Room Type"
              value={roomDetail.roomType}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl tracking-wide text-red-500">
            Section Pricing
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <PriceCard
              label="Front"
              seats={roomDetail.frontSeats}
              price={roomDetail.frontPrice}
            />
            <PriceCard
              label="Middle"
              seats={roomDetail.middleSeats}
              price={roomDetail.middlePrice}
            />
            <PriceCard
              label="Wing"
              seats={roomDetail.wingSeats}
              price={roomDetail.wingPrice}
            />
            <PriceCard
              label="Top"
              seats={roomDetail.topSeats}
              price={roomDetail.topPrice}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-6 pb-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 font-display text-2xl tracking-wide text-red-500">
            Room Layout
          </h2>
          <SeatMap seats={seats} room={roomDetail} takenSeats={[]} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-black/25 p-3 backdrop-blur-sm">
      <Icon className="h-4 w-4 text-white/70" />
      <p className="mt-2 text-[10px] uppercase tracking-wider text-white/60">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function PriceCard({ label, seats, price }) {
  if (!seats) return null;
  return (
    <div className="rounded-xl bg-red-950/20 p-4 ring-1 ring-red-900/40">
      <p className="text-[10px] uppercase tracking-wider text-stone-400">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl text-red-500">
        ${price?.toFixed(2)}
      </p>
      <p className="mt-0.5 text-[11px] text-stone-500">{seats} seats</p>
    </div>
  );
}
