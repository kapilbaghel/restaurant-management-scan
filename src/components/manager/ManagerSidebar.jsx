
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  UtensilsCrossed,
  Tags,
  QrCode,
  Settings,
  ChefHat,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        href: "/manager",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "RESTAURANT",
    items: [
      {
        name: "Live Orders",
        href: "/manager/orders",
        icon: ShoppingBag,
      },
      {
        name: "Order History",
        href: "/manager/order-history",
        icon: ClipboardList,
      },
      {
        name: "Menu Management",
        href: "/manager/menu",
        icon: UtensilsCrossed,
      },
      {
        name: "Categories",
        href: "/manager/categories",
        icon: Tags,
      },
      {
        name: "Tables & QR",
        href: "/manager/tables",
        icon: QrCode,
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        name: "Settings",
        href: "/manager/settings",
        icon: Settings,
      },
    ],
  },
];

export default function ManagerSidebar() {
  const pathname = usePathname();

  return (
   <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-white/10 bg-[#073D32] text-white">

      {/* BRAND */}
      <div className="flex h-24 shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D9A653] text-[#073D32] shadow-md shadow-black/10">
          <ChefHat size={25} strokeWidth={2.2} />
        </div>

        <div>
          <h1 className="text-[21px] font-bold tracking-tight">
            Restaurant<span className="text-[#E4B766]">OS</span>
          </h1>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[2.5px] text-white/45">
            Manager Panel
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
<nav className="min-h-0 flex-1 space-y-6 overflow-y-auto scrollbar-hide px-4 py-5">

        {navigation.map((section) => (
          <div key={section.title}>
            <p className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-[#D9A653]/70">
              {section.title}
            </p>

            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/manager"
                    ? pathname === "/manager"
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center justify-between rounded-xl px-3.5 py-3.5 text-[13px] transition-all duration-200 ${
                      isActive
                        ? "bg-[#D9A653] font-semibold text-[#17382F] shadow-md shadow-black/10"
                        : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 1.8}
                      />
                      {item.name}
                    </span>

                    {isActive && (
                      <ChevronRight size={17} strokeWidth={2.5} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

      </nav>

      {/* FOOTER */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-bold tracking-wide text-[#E4B766]">
            RestaurantOS
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
            Restaurant Management System
          </p>
        </div>
      </div>

    </aside>
  );
}
