
"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  MapPin,
  Store,
} from "lucide-react";

export default function ManagerHeader() {
  const [manager, setManager] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await fetch("/api/manager/me", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setManager(data.manager);
          setRestaurant(data.restaurant);
        }
      } catch (error) {
        console.error("Header data error:", error);
      }
    };

    fetchManager();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E9E1D6] bg-white/95 px-8 backdrop-blur">

      {/* RESTAURANT DETAILS */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F0E4] text-[#A77D3E]">
          <Store size={20} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#292521]">
            {restaurant?.name || "Your Restaurant"}
          </p>

          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#91877B]">
            <MapPin size={12} />
            {[restaurant?.address, restaurant?.city]
              .filter(Boolean)
              .join(", ") || "Restaurant Location"}
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5">

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#EEE7DE] text-[#766D62] transition hover:bg-[#F8F5F0]"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="h-9 w-px bg-[#EEE7DE]" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25221F] text-sm font-semibold text-[#D7B46A]">
            {manager?.name?.charAt(0)?.toUpperCase() || "M"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#292521]">
              {manager?.name || "Manager"}
            </p>

            <p className="text-xs text-[#91877B]">
              Restaurant Manager
            </p>
          </div>

          <ChevronDown size={16} className="text-[#91877B]" />
        </div>

      </div>
    </header>
  );
}
