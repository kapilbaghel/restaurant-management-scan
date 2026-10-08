"use client";

import {
  Building2,
  Users,
  ShoppingBag,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  Store,
  ClipboardList,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Restaurants",
      value: "05",
      description: "All restaurants",
      icon: Building2,
    },
    {
      title: "Active Restaurants",
      value: "03",
      description: "Currently active",
      icon: CheckCircle2,
    },
    {
      title: "Total Managers",
      value: "03",
      description: "Assigned managers",
      icon: Users,
    },
    {
      title: "Total Orders",
      value: "248",
      description: "All time orders",
      icon: ShoppingBag,
    },
  ];

  const restaurants = [
    {
      id: 1,
      name: "Desi Kitchen",
      location: "Gurgaon, Haryana",
      status: "Active",
      orders: 86,
    },
    {
      id: 2,
      name: "Spice Route",
      location: "Gurgaon, Haryana",
      status: "Active",
      orders: 72,
    },
    {
      id: 3,
      name: "Punjabi Dhaba",
      location: "Gurgaon, Haryana",
      status: "Active",
      orders: 54,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F7F4EE] text-[#171411]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
   <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-sm font-medium text-[#B88945]">
              Overview
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#716B64]">
              Manage your restaurant platform from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-[#E5DED4] bg-white px-4 py-2.5 sm:block">
              <p className="text-[11px] text-[#8B837A]">
                Today
              </p>

              <p className="mt-0.5 text-sm font-semibold">
                01 Oct 2026
              </p>
            </div>

            <a
              href="/admin/restaurants"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D5A960] px-5 py-3 text-sm font-semibold text-[#171411] transition hover:bg-[#C99A52]"
            >
              <Plus size={17} />
              Add Restaurant
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-[#E5DED4] bg-white p-5 shadow-[0_8px_30px_rgba(23,20,17,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(23,20,17,0.08)]"
              >
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-[#716B64]">
                      {stat.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight">
                      {stat.value}
                    </h2>

                    <p className="mt-2 text-xs text-[#9A9289]">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B88945] transition duration-300 group-hover:bg-[#D5A960] group-hover:text-[#171411]">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Main Dashboard Grid */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

          {/* Restaurant Overview */}
          <section className="overflow-hidden rounded-2xl border border-[#E5DED4] bg-white shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-[#E5DED4] px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold">
                  Restaurant Overview
                </h2>

                <p className="mt-1 text-sm text-[#716B64]">
                  Your restaurants at a glance.
                </p>
              </div>

              <a
                href="/admin/restaurants"
                className="flex items-center gap-1 text-sm font-medium text-[#B88945] transition hover:text-[#171411]"
              >
                View all
                <ArrowUpRight size={15} />
              </a>

            </div>

            {/* Restaurant List */}
            <div className="divide-y divide-[#EDE7DE]">

              {restaurants.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-[#FCFAF7]"
                >

                  <div className="flex min-w-0 items-center gap-4">

                    {/* Number */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F4EE] text-sm font-bold text-[#B88945]">
                      0{index + 1}
                    </div>

                    {/* Restaurant */}
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        {restaurant.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#716B64]">
                        {restaurant.location}
                      </p>
                    </div>

                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-5">

                    <div className="hidden text-right sm:block">
                      <p className="text-[11px] text-[#8B837A]">
                        Orders
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {restaurant.orders}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#E8F2EB] px-3 py-1 text-[11px] font-semibold text-[#3F7D5A]">
                      {restaurant.status}
                    </span>

                  </div>
                </div>
              ))}

            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-[#E5DED4] bg-white p-6 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

            <div>
              <h2 className="text-lg font-semibold">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-[#716B64]">
                Frequently used admin actions.
              </p>
            </div>

            <div className="mt-6 space-y-3">

              {/* Add Restaurant */}
              <a
                href="/admin/restaurants"
                className="group flex items-center justify-between rounded-xl border border-[#E5DED4] p-4 transition hover:border-[#D5A960] hover:bg-[#FCFAF7]"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B88945]">
                    <Plus size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Add Restaurant
                    </p>

                    <p className="mt-1 text-xs text-[#716B64]">
                      Create a new restaurant
                    </p>
                  </div>

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-[#9A9289] transition group-hover:text-[#171411]"
                />
              </a>

              {/* Manage Restaurants */}
              <a
                href="/admin/restaurants"
                className="group flex items-center justify-between rounded-xl border border-[#E5DED4] p-4 transition hover:border-[#D5A960] hover:bg-[#FCFAF7]"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B88945]">
                    <Store size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Manage Restaurants
                    </p>

                    <p className="mt-1 text-xs text-[#716B64]">
                      View and manage restaurants
                    </p>
                  </div>

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-[#9A9289] transition group-hover:text-[#171411]"
                />
              </a>

              {/* Orders */}
              <a
                href="/admin/orders"
                className="group flex items-center justify-between rounded-xl border border-[#E5DED4] p-4 transition hover:border-[#D5A960] hover:bg-[#FCFAF7]"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B88945]">
                    <ClipboardList size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      View Orders
                    </p>

                    <p className="mt-1 text-xs text-[#716B64]">
                      Monitor restaurant orders
                    </p>
                  </div>

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-[#9A9289] transition group-hover:text-[#171411]"
                />
              </a>

            </div>

            {/* Bottom Info */}
            <div className="mt-6 rounded-xl bg-[#F7F4EE] p-4">
              <p className="text-xs font-medium text-[#716B64]">
                Platform Overview
              </p>

              <div className="mt-3 flex items-end justify-between">

                <div>
                  <p className="text-2xl font-bold">
                    05
                  </p>

                  <p className="mt-1 text-xs text-[#8B837A]">
                    Restaurants connected
                  </p>
                </div>

                <Building2
                  size={28}
                  strokeWidth={1.5}
                  className="text-[#C99A52]"
                />

              </div>
            </div>

          </section>
        </div>

      </main>
    </div>
  );
}