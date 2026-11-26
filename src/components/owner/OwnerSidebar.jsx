
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function OwnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/owner" },
    { name: "Restaurants", href: "/owner/restaurants" },
    { name: "Managers", href: "/owner/managers" },
    { name: "Menu", href: "/owner/menu" },
    { name: "Tables", href: "/owner/tables" },
    { name: "QR Codes", href: "/owner/qr-codes" },
    { name: "Orders", href: "/owner/orders" },
    { name: "Settings", href: "/owner/settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E8E0D5] bg-[#F5F0E7] px-4 lg:hidden">

        <h2 className="text-lg font-bold tracking-tight text-[#102D26]">
          Owner Panel
        </h2>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8E0D5] bg-white text-2xl text-[#102D26] transition-colors hover:bg-[#EEE7DC]"
        >
          {isOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-auto border-r border-[#1C493B] bg-[#102D26] p-5 text-white shadow-[8px_0_30px_rgba(16,45,38,0.10)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* Branding */}
        <div className="mb-10 flex items-center justify-between">

          <h2 className="text-xl font-bold tracking-tight text-[#FFFDFA]">
            Owner Panel
          </h2>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="text-2xl text-white/70 transition-colors hover:text-[#C5A16A] lg:hidden"
          >
            ×
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">

          {menuItems.map((item) => {
            const isActive =
              item.href === "/owner"
                ? pathname === "/owner"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-4 py-3 text-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#C5A16A] text-[#102D26] shadow-sm"
                    : "text-[#E8EDE9] hover:bg-[#1C493B] hover:text-[#E6C98F]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={async () => {
            try {
              const response = await fetch("/api/owners/logout", {
                method: "POST",
                credentials: "include",
              });

              if (!response.ok) {
                throw new Error("Owner logout failed.");
              }

              setIsOpen(false);
              router.replace("/login");
              router.refresh();
            } catch (error) {
              console.error("Owner logout error:", error);
            }
          }}
          className="mt-8 w-full rounded-xl border-t border-white/10 px-4 py-4 pt-5 text-left text-[14px] font-medium text-[#E8EDE9] transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          Logout
        </button>

      </aside>
    </>
  );
}
