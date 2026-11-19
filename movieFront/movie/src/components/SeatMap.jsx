import React, { useEffect, useMemo, useState } from "react";
import { Armchair, X, Check } from "lucide-react";

const SECTION_STYLE = {
  TOP: { label: "Top", color: "text-amber-400", ring: "ring-amber-500/40" },
  WING: { label: "Wing", color: "text-violet-400", ring: "ring-violet-500/40" },
  MIDDLE: { label: "Middle", color: "text-sky-400", ring: "ring-sky-500/40" },
  FRONT: {
    label: "Front",
    color: "text-emerald-400",
    ring: "ring-emerald-500/40",
  },
};

function priceForSection(room, section) {
  switch (section) {
    case "FRONT":
      return room?.frontPrice ?? 0;
    case "MIDDLE":
      return room?.middlePrice ?? 0;
    case "WING":
      return room?.wingPrice ?? 0;
    case "TOP":
      return room?.topPrice ?? 0;
    default:
      return 0;
  }
}

function groupBySectionRow(seats) {
  const bySection = {};
  for (const seat of seats) {
    const section = seat.section ?? "MIDDLE";
    if (!bySection[section]) bySection[section] = {};
    const row = seat.rowLabel ?? "A";
    if (!bySection[section][row]) bySection[section][row] = [];
    bySection[section][row].push(seat);
  }
  for (const section of Object.keys(bySection)) {
    for (const row of Object.keys(bySection[section])) {
      bySection[section][row].sort((a, b) => a.seatNumber - b.seatNumber);
    }
  }
  return bySection;
}

function chunk(arr, size) {
  if (size <= 0) return [arr];
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function SeatButton({ seat, room, style, isTaken, isSelected, onToggle }) {
  const price = priceForSection(room, seat.section);

  if (isTaken) {
    return (
      <div
        title={`${seat.rowLabel}${seat.seatNumber} · Taken`}
        className="flex h-6 w-6 cursor-not-allowed items-center justify-center rounded-md bg-red-950/60 ring-1 ring-red-800/50 text-red-500/70"
      >
        <X className="h-3.5 w-3.5" />
      </div>
    );
  }

  if (isSelected) {
    return (
      <button
        type="button"
        onClick={() => onToggle(seat.id)}
        title={`${seat.rowLabel}${seat.seatNumber} · $${price.toFixed(2)}`}
        className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 ring-1 ring-emerald-400 text-zinc-950 transition-transform hover:scale-105"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(seat.id)}
      title={`${seat.rowLabel}${seat.seatNumber} · $${price.toFixed(2)}`}
      className={`flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 ring-1 ${style.ring} text-stone-500 transition-colors duration-150 hover:bg-zinc-700 hover:text-stone-300`}
    >
      <Armchair className="h-3.5 w-3.5" />
    </button>
  );
}

function HorizontalBlock({
  section,
  rows,
  room,
  takenSet,
  selectedSet,
  onToggle,
}) {
  const style = SECTION_STYLE[section] ?? SECTION_STYLE.MIDDLE;
  const price = priceForSection(room, section);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-center gap-2">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${style.color}`}
        >
          {style.label}
        </p>
        <span className="text-[10px] text-stone-600">·</span>
        <p className="text-[10px] font-semibold text-stone-500">
          ${price.toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        {Object.entries(rows)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-1.5">
              <span className="w-4 text-right text-[10px] font-bold text-stone-600">
                {row}
              </span>
              <div className="flex gap-1.5">
                {rowSeats.map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    room={room}
                    style={style}
                    isTaken={takenSet.has(seat.id)}
                    isSelected={selectedSet.has(seat.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function MiddleBlock({ rows, room, takenSet, selectedSet, onToggle }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
          Middle
        </p>
        <span className="text-[10px] text-stone-600">·</span>
        <p className="text-[10px] font-semibold text-stone-500">
          ${priceForSection(room, "MIDDLE").toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        {Object.entries(rows)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-1.5">
              <span className="w-4 text-right text-[10px] font-bold text-stone-600">
                {row}
              </span>
              <div className="flex gap-1.5">
                {rowSeats.map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    room={room}
                    style={SECTION_STYLE.MIDDLE}
                    isTaken={takenSet.has(seat.id)}
                    isSelected={selectedSet.has(seat.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function WingBlock({
  seats,
  room,
  side,
  columnHeight,
  takenSet,
  selectedSet,
  onToggle,
}) {
  const style = SECTION_STYLE.WING;
  if (seats.length === 0) return null;

  const columns = chunk(seats, columnHeight);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p
        className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${style.color}`}
      >
        {side}
      </p>
      <div className="flex gap-1.5 rounded-xl bg-black/20 p-2">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            {col.map((seat) => (
              <SeatButton
                key={seat.id}
                seat={seat}
                room={room}
                style={style}
                isTaken={takenSet.has(seat.id)}
                isSelected={selectedSet.has(seat.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeatMap({
  seats,
  room,
  takenSeats,
  onSelectionChange,
}) {
  const grouped = useMemo(() => groupBySectionRow(seats ?? []), [seats]);
  const takenSet = useMemo(() => new Set(takenSeats ?? []), [takenSeats]);
  const [selectedIds, setSelectedIds] = useState([]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [selectedIds, onSelectionChange]);

  function handleToggle(seatId) {
    setSelectedIds((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  }

  const middleRowCount = grouped.MIDDLE
    ? Object.keys(grouped.MIDDLE).length
    : 6;

  const wingLeft = [];
  const wingRight = [];
  if (grouped.WING) {
    Object.keys(grouped.WING)
      .sort()
      .forEach((row) => {
        const rowSeats = grouped.WING[row];
        const mid = Math.ceil(rowSeats.length / 2);
        wingLeft.push(...rowSeats.slice(0, mid));
        wingRight.push(...rowSeats.slice(mid));
      });
  }

  if (!seats || seats.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl bg-zinc-900 text-sm text-stone-500 ring-1 ring-white/10">
        Loading seat map…
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-zinc-900 p-6 ring-1 ring-white/10 sm:p-10">
      <div className="mx-auto mb-10 h-2 w-3/4 rounded-full bg-gradient-to-r from-transparent via-amber-400/70 to-transparent shadow-[0_0_25px_rgba(251,191,36,0.5)]" />
      <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
        Screen
      </p>

      <div className="flex flex-col items-center gap-10">
        {grouped.TOP && (
          <HorizontalBlock
            section="TOP"
            rows={grouped.TOP}
            room={room}
            takenSet={takenSet}
            selectedSet={selectedSet}
            onToggle={handleToggle}
          />
        )}

        <div className="flex items-start justify-center gap-6">
          <WingBlock
            seats={wingLeft}
            room={room}
            side="Wing L"
            columnHeight={middleRowCount}
            takenSet={takenSet}
            selectedSet={selectedSet}
            onToggle={handleToggle}
          />

          {grouped.MIDDLE && (
            <MiddleBlock
              rows={grouped.MIDDLE}
              room={room}
              takenSet={takenSet}
              selectedSet={selectedSet}
              onToggle={handleToggle}
            />
          )}

          <WingBlock
            seats={wingRight}
            room={room}
            side="Wing R"
            columnHeight={middleRowCount}
            takenSet={takenSet}
            selectedSet={selectedSet}
            onToggle={handleToggle}
          />
        </div>

        {grouped.FRONT && (
          <HorizontalBlock
            section="FRONT"
            rows={grouped.FRONT}
            room={room}
            takenSet={takenSet}
            selectedSet={selectedSet}
            onToggle={handleToggle}
          />
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-5 border-t border-white/10 pt-6">
        {Object.entries(SECTION_STYLE).map(([key, style]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className={`h-3 w-3 rounded ${style.ring} ring-1 bg-zinc-800`}
            />
            <span className="text-[10px] text-stone-400">{style.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded ring-1 ring-red-800/50 bg-red-950/60" />
          <span className="text-[10px] text-stone-400">Taken</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded ring-1 ring-emerald-400 bg-emerald-500" />
          <span className="text-[10px] text-stone-400">Selected</span>
        </div>
      </div>
    </div>
  );
}
