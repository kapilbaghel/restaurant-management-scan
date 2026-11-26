
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const activeClass =
    "block rounded-xl bg-[#D6AD70] px-4 py-3 font-semibold text-[#17392D] shadow-sm";

  const inactiveClass =
    "block rounded-xl px-4 py-3 text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white";

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#17392D] px-5 text-white lg:hidden">
        <h2 className="text-lg font-bold tracking-tight">
          RestaurantOS
        </h2>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl p-2 transition hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
         fixed left-0 top-0 z-50 min-h-screen h-screen w-64 self-start
          border-r border-white/10
          bg-[#17392D] p-6 text-white
          transition-transform duration-300
          lg:sticky lg:block lg:shrink-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Brand */}
        <div className="border-b border-white/10 pb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">
            RestaurantOS
          </h2>

          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D6AD70]">
            Administration
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2">

          {/* Dashboard */}
          <a
            href="/admin"
            className={
              pathname === "/admin"
                ? activeClass
                : inactiveClass
            }
          >
            Dashboard
          </a>

          {/* Owners */}
          {/* <a
            href="/admin/owners"
            className={
              pathname.startsWith("/admin/owners")
                ? activeClass
                : inactiveClass
            }
          >
            Owners
          </a> */}

          {/* Restaurants */}
          <a
            href="/admin/restaurants"
            className={
              pathname.startsWith("/admin/restaurants")
                ? activeClass
                : inactiveClass
            }
          >
            Restaurants
          </a>

          {/* Orders */}
          <a
            href="/admin/orders"
            className={
              pathname.startsWith("/admin/orders")
                ? activeClass
                : inactiveClass
            }
          >
            Orders
          </a>

          {/* Settings */}
          <a
            href="/admin/settings"
            className={
              pathname.startsWith("/admin/settings")
                ? activeClass
                : inactiveClass
            }
          >
            Settings
          </a>

        </nav>

        {/* Logout */}
        <div className="mt-8 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={async () => {
              try {
                await fetch("/api/admin/logout", {
                  method: "POST",
                  credentials: "include",
                });

                localStorage.removeItem("loggedInAdminId");
                router.replace("/login");
              } catch (error) {
                console.error("Admin logout error:", error);
              }
            }}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-white/75 transition hover:bg-red-500/10 hover:text-red-300"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}
    </>
  );
}
