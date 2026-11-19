import React, { useState } from "react";
import {
  DoorOpen,
  MonitorPlay,
  Volume2,
  Users,
  LayoutGrid,
  Tv,
  Armchair,
} from "lucide-react";
import { toast } from "sonner";
import { createRoom } from "../axios/apis";

const ROOM_TYPES = ["STANDARD", "VIP", "IMAX"];

const SECTION_DEFS = [
  { key: "front", label: "Front", accent: "text-sky-400", dot: "bg-sky-400" },
  {
    key: "middle",
    label: "Middle",
    accent: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  { key: "wing", label: "Wing", accent: "text-amber-400", dot: "bg-amber-400" },
  { key: "top", label: "Top", accent: "text-rose-400", dot: "bg-rose-400" },
];

const SEAT_PLACEHOLDERS = {
  front: "e.g. 20",
  middle: "e.g. 60",
  wing: "e.g. 30",
  top: "e.g. 10",
};
const PRICE_PLACEHOLDERS = {
  front: "e.g. 7.00",
  middle: "e.g. 9.50",
  wing: "e.g. 8.00",
  top: "e.g. 11.00",
};

const MAX_VISIBLE_SEATS_PER_ROW = 40;

const EMPTY_SECTIONS = {
  front: { seats: "", price: "" },
  middle: { seats: "", price: "" },
  wing: { seats: "", price: "" },
  top: { seats: "", price: "" },
};

function FieldLabel({ icon: Icon, children }) {
  return (
    <label className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
      <Icon className="h-3 w-3" />
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-stone-700 bg-white/5 py-2.5 px-3.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition-colors focus:border-amber-400 focus:bg-amber-400/5";

function SectionCard({ def, seats, price, onSeatsChange, onPriceChange }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p
        className={`mb-3 text-[10.5px] font-bold uppercase tracking-widest ${def.accent}`}
      >
        {def.label}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-stone-500">
            Seats
          </span>
          <input
            type="number"
            min="0"
            value={seats}
            onChange={(e) => onSeatsChange(e.target.value)}
            placeholder={SEAT_PLACEHOLDERS[def.key]}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-stone-500">
            Price
          </span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder={PRICE_PLACEHOLDERS[def.key]}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateRoomForm() {
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
  const [screenSize, setScreenSize] = useState("");
  const [screenPosition, setScreenPosition] = useState("");
  const [soundSystem, setSoundSystem] = useState("");

  const [sections, setSections] = useState(EMPTY_SECTIONS);

  function updateSection(key, field, value) {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  function resetForm() {
    setRoomName("");
    setRoomType(ROOM_TYPES[0]);
    setScreenSize("");
    setScreenPosition("");
    setSoundSystem("");
    setSections(EMPTY_SECTIONS);
  }

  const totalSeats = SECTION_DEFS.reduce(
    (sum, { key }) => sum + (Number(sections[key].seats) || 0),
    0,
  );

  const potentialRevenue = SECTION_DEFS.reduce((sum, { key }) => {
    const seats = Number(sections[key].seats) || 0;
    const price = Number(sections[key].price) || 0;
    return sum + seats * price;
  }, 0);

  const priceValues = SECTION_DEFS.map(({ key }) =>
    Number(sections[key].price),
  ).filter((p) => p > 0);
  const minPrice = priceValues.length ? Math.min(...priceValues) : null;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : null;

  async function handleSubmitRoom() {
    const form = {
      name: roomName,
      roomType: roomType,
      screenPosition: screenPosition,
      screenSize: screenSize,
      soundSystem: soundSystem,
      totalSeats: totalSeats,

      frontSeats: sections.front.seats,
      frontPrice: sections.front.price,

      middleSeats: sections.middle.seats,
      middlePrice: sections.middle.price,

      wingSeats: sections.wing.seats,
      wingPrice: sections.wing.price,

      topSeats: sections.top.seats,
      topPrice: sections.top.price,
    };

    try {
      const response = await createRoom(form);

      if (response.status === 201) {
        toast.success("Successfully created");
        resetForm();
      }
    } catch (err) {
      toast.error(`Failed to create room: ${err.message}`);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-900">
          <DoorOpen className="h-5 w-5 text-stone-50" />
        </span>
        <div>
          <h1 className="font-display text-3xl tracking-wide text-stone-100">
            Create Room
          </h1>
          <p className="text-xs text-stone-400">
            Set up a new screening room. The seat map updates as you type.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ───────────────────── FORM ───────────────────── */}
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <p className="mb-4 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
              Room Info
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <FieldLabel icon={DoorOpen}>Room Name</FieldLabel>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Room 1 - IMAX"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={LayoutGrid}>Room Type</FieldLabel>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className={inputClass}
                >
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-zinc-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={MonitorPlay}>Screen Size</FieldLabel>
                <input
                  type="text"
                  value={screenSize}
                  onChange={(e) => setScreenSize(e.target.value)}
                  placeholder="e.g. LARGE"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={MonitorPlay}>Screen Position</FieldLabel>
                <input
                  type="text"
                  value={screenPosition}
                  onChange={(e) => setScreenPosition(e.target.value)}
                  placeholder="e.g. CENTER"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel icon={Volume2}>Sound System</FieldLabel>
                <input
                  type="text"
                  value={soundSystem}
                  onChange={(e) => setSoundSystem(e.target.value)}
                  placeholder="e.g. DOLBY_ATMOS"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
                <Users className="h-3 w-3" />
                Seating & Pricing
              </p>
              <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-300">
                Total seats
                <span className="text-amber-400">{totalSeats}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SECTION_DEFS.map((def) => (
                <SectionCard
                  key={def.key}
                  def={def}
                  seats={sections[def.key].seats}
                  price={sections[def.key].price}
                  onSeatsChange={(v) => updateSection(def.key, "seats", v)}
                  onPriceChange={(v) => updateSection(def.key, "price", v)}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <span className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-bold text-stone-400 hover:text-stone-200">
              Cancel
            </span>
            <button
              onClick={handleSubmitRoom}
              className="rounded-lg bg-red-900 px-6 py-2.5 text-sm font-extrabold tracking-wide text-stone-50 shadow-lg shadow-red-950/50 transition-all hover:-translate-y-0.5 hover:bg-red-800"
            >
              Create Room
            </button>
          </div>
        </div>

        {/* ───────────────────── LIVE PREVIEW ───────────────────── */}
        <aside className="w-full flex-shrink-0 lg:sticky lg:top-8 lg:w-[340px]">
          <p className="mb-3 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-stone-500">
            <LayoutGrid className="h-3.5 w-3.5" />
            Live Preview
          </p>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-2xl leading-tight tracking-wide text-stone-100">
                  {roomName || (
                    <span className="text-stone-600">Unnamed room</span>
                  )}
                </h3>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  {[screenSize, screenPosition, soundSystem]
                    .filter(Boolean)
                    .join(" · ") || "No screen or sound details yet"}
                </p>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                  roomType === "IMAX"
                    ? "bg-sky-400/15 text-sky-400"
                    : roomType === "VIP"
                      ? "bg-amber-400/15 text-amber-400"
                      : "bg-white/10 text-stone-300"
                }`}
              >
                {roomType}
              </span>
            </div>

            {/* Screen */}
            <div className="mt-6 flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-stone-600">
                <Tv className="h-3 w-3" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
                  Screen
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-gradient-to-r from-transparent via-stone-500/60 to-transparent" />
            </div>

            {/* Seat map */}
            <div className="mt-5 flex flex-col gap-3">
              {SECTION_DEFS.map((def) => {
                const seats = Number(sections[def.key].seats) || 0;
                const price = sections[def.key].price;
                const visible = Math.min(seats, MAX_VISIBLE_SEATS_PER_ROW);
                const overflow = seats - visible;

                if (seats === 0) return null;

                return (
                  <div key={def.key}>
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${def.accent}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${def.dot}`}
                        />
                        {def.label}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {seats} seat{seats === 1 ? "" : "s"}
                        {price && ` · $${Number(price).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-[3px]">
                      {Array.from({ length: visible }).map((_, i) => (
                        <Armchair
                          key={i}
                          className={`h-3 w-3 ${def.accent} opacity-80`}
                        />
                      ))}
                      {overflow > 0 && (
                        <span className="ml-1 self-center text-[9px] font-semibold text-stone-500">
                          +{overflow}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {totalSeats === 0 && (
                <p className="text-center text-xs text-stone-600">
                  Add seats to a section to see the map.
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Total capacity
                </p>
                <p className="mt-0.5 text-lg font-extrabold text-stone-100">
                  {totalSeats}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Price range
                </p>
                <p className="mt-0.5 text-lg font-extrabold text-stone-100">
                  {minPrice !== null
                    ? minPrice === maxPrice
                      ? `$${minPrice.toFixed(2)}`
                      : `$${minPrice.toFixed(2)}–${maxPrice.toFixed(2)}`
                    : "—"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Full-house potential
                </p>
                <p className="mt-0.5 text-lg font-extrabold text-amber-400">
                  ${potentialRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-[10.5px] text-stone-600">
            Seat icons are proportional, not exact seat positions.
          </p>
        </aside>
      </div>
    </div>
  );
}
