"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OwnerSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/owner",
    },
    {
      name: "Restaurants",
      href: "/owner/restaurants",
    },
    {
      name: "Managers",
      href: "/owner/managers",
    },
    {
      name: "Menu",
      href: "/owner/menu",
    },
    {
      name: "Tables",
      href: "/owner/tables",
    },
    {
      name: "QR Codes",
      href: "/owner/qr-codes",
    },
    {
      name: "Orders",
      href: "/owner/orders",
    },
    {
      name: "Settings",
      href: "/owner/settings",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background p-5">
      <h2 className="mb-8 text-xl font-bold">
        Owner Panel
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}