"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/format";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  id?: string;
}

const WEEKDAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function DatePicker({ value, onChange, min, max, id }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = value ? new Date(value) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const todayISO = toISO(new Date());
  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  const minTime = min ? new Date(`${min}T12:00:00`).getTime() : null;
  const maxTime = max ? new Date(`${max}T12:00:00`).getTime() : null;

  const isDisabled = (day: number): boolean => {
    const t = new Date(year, month, day, 12, 0, 0).getTime();
    if (minTime !== null && t < minTime) return true;
    if (maxTime !== null && t > maxTime) return true;
    return false;
  };

  const monthLabel = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(view);

  const go = (delta: number) =>
    setView(new Date(year, month + delta, 1));

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}>
          {value ? formatDate(value) : "Sélectionner une date"}
        </span>
        <CalendarDays className="size-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-[17rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-xl ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Mois précédent"
              className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <p className="text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">
              {monthLabel}
            </p>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Mois suivant"
              className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="py-1 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                day,
              ).padStart(2, "0")}`;
              const selected = iso === value;
              const isToday = iso === todayISO;
              const disabled = isDisabled(day);

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={`mx-auto grid size-9 place-items-center rounded-lg text-sm transition-colors ${
                    selected
                      ? "bg-emerald-600 font-bold text-white"
                      : disabled
                        ? "text-slate-300"
                        : isToday
                          ? "font-bold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-600/40"
                          : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
            <button
              type="button"
              onClick={() => {
                onChange(todayISO);
                setOpen(false);
              }}
              className="w-full rounded-lg px-2 py-1.5 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              Aujourd&apos;hui
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
