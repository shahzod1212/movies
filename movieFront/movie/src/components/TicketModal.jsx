import React, { useEffect, useState } from "react";
import { X, Calendar, Clock, Timer, DoorOpen, Ticket } from "lucide-react";
import SeatMap from "./SeatMap";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeatsByRoom } from "../redux/seatSlice";
import { toast } from "sonner";
import { createBooking, getTakenSeatIds } from "../axios/apis";

const TicketModal = ({ showtime, onClose }) => {
  if (!showtime) return null;

  const { movie, room, date, startTime, durationHour, durationMinute } =
    showtime;
  const dispatch = useDispatch();
  const seats = useSelector((state) => state.seat.seats);
  const [takenSeats, setTakenSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  async function fetchTakingSeats() {
    try {
      const response = await getTakenSeatIds(showtime.id);

      if (response.status === 200) {
        setTakenSeats(response.data);
      }
    } catch (err) {
      toast.error("Cannot fetch the seats. We are working on it.");
    }
  }
  function handleSelectedSeats(ids) {
    setSelectedSeats(ids);
  }

  async function handleSubmitBooking() {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    try {
      const response = await createBooking({
        showtimeId: showtime.id,
        seatIds: selectedSeats,
      });

      if (response.status === 200 && response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Could not start checkout. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (room.id) {
      dispatch(fetchSeatsByRoom(room.id));
    }
    if (showtime.id) {
      fetchTakingSeats();
    }
  }, [dispatch, showtime]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-zinc-950 ring-1 ring-red-900/40 shadow-2xl shadow-black/60">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-stone-300 transition-colors hover:bg-white/20 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-[30%] min-w-[220px] flex-col overflow-y-auto border-r border-red-900/30 bg-zinc-900/60">
            <div className="relative h-56 w-full shrink-0 overflow-hidden">
              <img
                src={movie?.posterUrl}
                alt={movie?.title}
                className="h-full w-full object-contain"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col gap-5 p-5">
              <div>
                <h2 className="font-display text-2xl leading-none tracking-wide text-white">
                  {movie?.title}
                </h2>
                {movie?.durationTime && (
                  <p className="mt-1 text-xs text-red-300">
                    {movie.durationTime}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <DetailRow icon={Calendar} label="Date" value={date} />
                <DetailRow icon={Clock} label="Start Time" value={startTime} />
                <DetailRow
                  icon={Timer}
                  label="Duration"
                  value={
                    durationHour != null && durationMinute != null
                      ? `${durationHour}h ${durationMinute}m`
                      : null
                  }
                />
                <DetailRow icon={DoorOpen} label="Room" value={room?.name} />
              </div>

              {room?.roomType && (
                <span className="w-fit rounded-full bg-red-950/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300 ring-1 ring-red-800/40">
                  {room.roomType}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-6">
            <h3 className="mb-4 font-display text-xl tracking-wide text-red-500">
              Select Your Seats
            </h3>
            <div className="flex-1">
              <SeatMap
                seats={seats}
                room={room}
                takenSeats={takenSeats}
                onSelectionChange={handleSelectedSeats}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-red-900/30 bg-zinc-900/60 px-6 py-4">
          <p className="text-xs text-stone-400">
            Select your seats to see the total price.
          </p>
          <button
            onClick={handleSubmitBooking}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-red-700 to-orange-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-900/40 transition-all hover:from-red-600 hover:to-orange-500 hover:scale-[1.03]"
          >
            <Ticket className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            Book the Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
        <Icon className="h-3.5 w-3.5 text-red-500" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-red-400">
          {label}
        </p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export default TicketModal;
