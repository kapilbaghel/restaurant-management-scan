"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

return (
  <>
    {/* Mobile Header */}
    <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-brand-espresso px-4 text-white lg:hidden">
      <h2 className="text-lg font-semibold">
        RestaurantOS
      </h2>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-2 hover:bg-white/10"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    {/* Sidebar */}
    <aside
      className={`
        fixed left-0 top-0 z-50 h-screen w-64
        bg-brand-espresso p-6 text-white
        transition-transform duration-300
        lg:sticky lg:block
        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
    >

      <h2 className="text-xl font-semibold">
        RestaurantOS
      </h2>

      <nav className="mt-8 space-y-2">

        {/* Dashboard */}
        <a
          href="/admin"
          className={
            pathname === "/admin"
              ? "block rounded-lg bg-brand-gold px-4 py-3 text-brand-espresso"
              : "block rounded-lg px-4 py-3 hover:bg-white/10"
          }
        >
          Dashboard
        </a>

        {/* Owners */}
        {/* <a
          href="/admin/owners"
          className={
            pathname.startsWith("/admin/owners")
              ? "block rounded-lg bg-brand-gold px-4 py-3 text-brand-espresso"
              : "block rounded-lg px-4 py-3 hover:bg-white/10"
          }
        >
          Owners
        </a> */}

        {/* Restaurants */}
        <a
          href="/admin/restaurants"
          className={
            pathname.startsWith("/admin/restaurants")
              ? "block rounded-lg bg-brand-gold px-4 py-3 text-brand-espresso"
              : "block rounded-lg px-4 py-3 hover:bg-white/10"
          }
        >
          Restaurants
        </a>

        {/* Orders */}
        <a
          href="/admin/orders"
          className={
            pathname.startsWith("/admin/orders")
              ? "block rounded-lg bg-brand-gold px-4 py-3 text-brand-espresso"
              : "block rounded-lg px-4 py-3 hover:bg-white/10"
          }
        >
          Orders
        </a>

        {/* Settings */}
        <a
          href="/admin/settings"
          className={
            pathname.startsWith("/admin/settings")
              ? "block rounded-lg bg-brand-gold px-4 py-3 text-brand-espresso"
              : "block rounded-lg px-4 py-3 hover:bg-white/10"
          }
        >
          Settings
        </a>

      </nav>

      <button
        type="button"
        onClick={() => {
          localStorage.removeItem("loggedInAdminId");
          router.replace("/admin/login");
        }}
        className="mt-8 w-full rounded-lg px-4 py-3 text-left hover:bg-white/10"
      >
        Logout
      </button>

    </aside>

    {/* Mobile Overlay */}
    {isOpen && (
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
      />
    )}
  </>
);
}