"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown, Plus, UserPlus, X } from "lucide-react";
import type { MockClient } from "@/lib/data";

interface ClientComboboxProps {
  clients: MockClient[];
  initialName?: string;
  onSelect: (client: MockClient) => void;
  onClear: () => void;
  onQueryChange: (query: string) => void;
  id?: string;
}

export function ClientCombobox({
  clients,
  initialName,
  onSelect,
  onClear,
  onQueryChange,
  id,
}: ClientComboboxProps) {
  const [query, setQuery] = useState(initialName ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const normalized = query.trim().toLowerCase();
  const filtered = clients
    .filter((c) => c.name.toLowerCase().includes(normalized))
    .slice(0, 8);
  const hasExactMatch = clients.some(
    (c) => c.name.trim().toLowerCase() === normalized,
  );

  const handleChange = (value: string) => {
    setQuery(value);
    onQueryChange(value);
    setOpen(true);
  };

  const handleSelect = (client: MockClient) => {
    setQuery(client.name);
    setOpen(false);
    onSelect(client);
  };

  const handleAddNew = () => {
    setOpen(false);
    onQueryChange(query);
  };

  const handleClear = () => {
    setQuery("");
    setOpen(false);
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return;
    const matched = clients.find(
      (c) => c.name.trim().toLowerCase() === normalizedQuery,
    );
    if (matched) {
      handleSelect(matched);
    } else {
      handleAddNew();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="client-listbox"
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Sélectionnez ou saisissez un client…"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-3 pr-9 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Effacer la sélection"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <ChevronsUpDown
            className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
        )}
      </div>

      {open && (
        <ul
          id="client-listbox"
          role="listbox"
          className="absolute left-0 z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 shadow-xl ring-1 ring-slate-900/5"
        >
          {normalized.length > 0 && !hasExactMatch && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleAddNew}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-emerald-600/10">
                  <Plus className="size-3.5" aria-hidden="true" />
                </span>
                <span>
                  Créer le client «{" "}
                  <span className="font-semibold">{query.trim()}</span> »
                </span>
              </button>
            </li>
          )}

          {filtered.length === 0 && !(normalized.length > 0 && !hasExactMatch) && (
            <li className="px-3 py-4 text-center text-sm text-slate-400 dark:text-slate-500">
              {clients.length === 0 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <UserPlus className="size-4 shrink-0" aria-hidden="true" />
                  Aucun client trouvé — saisissez un nom pour créer un client.
                </span>
              ) : (
                "Aucun client trouvé."
              )}
            </li>
          )}

          {filtered.map((client) => {
            const selected = client.name.trim().toLowerCase() === normalized;
            return (
              <li key={client.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(client)}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    {client.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                      {client.name}
                    </span>
                    {(client.email || client.phone) && (
                      <span className="block truncate text-xs text-slate-400 dark:text-slate-500">
                        {[client.email, client.phone].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </span>
                  {selected && (
                    <Check className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}

          {normalized.length === 0 && filtered.length > 0 && (
            <li className="border-t border-slate-100 dark:border-slate-800">
              <p className="flex items-center gap-1.5 px-3 py-2 text-[11px] text-slate-400 dark:text-slate-500">
                <UserPlus className="size-3.5" aria-hidden="true" />
                Astuce : saisissez un nom pour créer un nouveau client.
              </p>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
