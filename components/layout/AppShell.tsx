"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { DataProvider } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // En mode création ou édition de facture : pas de sidebar fixe, un menu
  // hamburger en haut à gauche ouvre un tiroir pour gagner de la place
  // sur l'aperçu.
  const focused =
    pathname === "/invoices/new" || /^\/invoices\/[^/]+\/edit$/.test(pathname);

  return (
    <DataProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          drawerAlways={focused}
        />

        <div className={`flex min-h-screen flex-col ${focused ? "" : "lg:pl-64"}`}>
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            showMenuAlways={focused}
          />
          <main
            className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${
              focused ? "max-w-[1400px]" : "max-w-7xl"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}
