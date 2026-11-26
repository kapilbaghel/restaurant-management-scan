
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

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8894D]">
              Overview
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17392D] sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#716B64]">
              Manage your restaurant platform from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* Date */}
            <div className="rounded-xl border border-[#E6D9C9] bg-[#FFFEFC] px-4 py-2.5">
              <p className="text-[11px] text-[#8B837A]">
                Today
              </p>

              <p className="mt-0.5 text-sm font-semibold text-[#17392D]">
                01 Oct 2026
              </p>
            </div>

            {/* Add Restaurant */}
            <a
              href="/admin/restaurants"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D6AD70] px-5 py-3 text-sm font-semibold text-[#17392D] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#C99A52]"
            >
              <Plus size={18} />
              Add Restaurant
            </a>

          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-[#E6D9C9] bg-[#FFFEFC] p-5 shadow-[0_8px_30px_rgba(23,57,45,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(23,57,45,0.08)]"
              >
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-[#716B64]">
                      {stat.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#17392D]">
                      {stat.value}
                    </h2>

                    <p className="mt-2 text-xs text-[#9A9289]">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B8894D] transition duration-300 group-hover:bg-[#D6AD70] group-hover:text-[#17392D]">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Main Dashboard Grid */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

          {/* Restaurant Overview */}
          <section className="overflow-hidden rounded-2xl border border-[#E6D9C9] bg-[#FFFEFC] shadow-[0_8px_30px_rgba(23,57,45,0.04)]">

            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-[#E6D9C9] px-5 py-5 sm:px-6">

              <div>
                <h2 className="text-lg font-bold text-[#17392D]">
                  Restaurant Overview
                </h2>

                <p className="mt-1 text-sm text-[#716B64]">
                  Your restaurants at a glance.
                </p>
              </div>

              <a
                href="/admin/restaurants"
                className="flex items-center gap-1 text-sm font-semibold text-[#B8894D] transition hover:text-[#17392D]"
              >
                View all
                <ArrowUpRight size={16} />
              </a>

            </div>

            {/* Restaurant List */}
            <div className="divide-y divide-[#EEE5D9]">

              {restaurants.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  className="flex items-center justify-between gap-3 px-5 py-5 transition hover:bg-[#FAF7F2] sm:gap-4 sm:px-6"
                >

                  {/* Restaurant Details */}
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F4EE] text-sm font-bold text-[#B8894D]">
                      0{index + 1}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#17392D]">
                        {restaurant.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#8B837A]">
                        {restaurant.location}
                      </p>
                    </div>

                  </div>

                  {/* Orders and Status */}
                  <div className="flex shrink-0 items-center gap-3 sm:gap-5">

                    <div className="hidden text-right sm:block">
                      <p className="text-[11px] text-[#8B837A]">
                        Orders
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#17392D]">
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
          <section className="rounded-2xl border border-[#E6D9C9] bg-[#FFFEFC] p-5 shadow-[0_8px_30px_rgba(23,57,45,0.04)] sm:p-6">

            <div>
              <h2 className="text-lg font-bold text-[#17392D]">
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
                className="group flex items-center justify-between rounded-xl border border-[#E6D9C9] p-4 transition hover:border-[#D6AD70] hover:bg-[#FAF7F2]"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B8894D] transition group-hover:bg-[#D6AD70] group-hover:text-[#17392D]">
                    <Plus size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#17392D]">
                      Add Restaurant
                    </p>

                    <p className="mt-1 text-xs text-[#8B837A]">
                      Create a new restaurant
                    </p>
                  </div>

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-[#9A9289] transition group-hover:text-[#B8894D]"
                />
              </a>

              {/* Manage Restaurants */}
              <a
                href="/admin/restaurants"
                className="group flex items-center justify-between rounded-xl border border-[#E6D9C9] p-4 transition hover:border-[#D6AD70] hover:bg-[#FAF7F2]"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B8894D] transition group-hover:bg-[#D6AD70] group-hover:text-[#17392D]">
                    <Store size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#17392D]">
                      Manage Restaurants
                    </p>

                    <p className="mt-1 text-xs text-[#8B837A]">
                      View and manage restaurants
                    </p>
                  </div>

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-[#9A9289] transition group-hover:text-[#B8894D]"
                />
              </a>

              {/* Orders */}
              <a
                href="/admin/orders"
                className="group flex items-center justify-between rounded-xl border border-[#E6D9C9] p-4 transition hover:border-[#D6AD70] hover:bg-[#FAF7F2]"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B8894D] transition group-hover:bg-[#D6AD70] group-hover:text-[#17392D]">
                    <ClipboardList size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#17392D]">
                      View Orders
                    </p>

                    <p className="mt-1 text-xs text-[#8B837A]">
                      Monitor restaurant orders
                    </p>
                  </div>

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-[#9A9289] transition group-hover:text-[#B8894D]"
                />
              </a>

            </div>

            {/* Platform Overview */}
            <div className="mt-6 rounded-xl border border-[#EEE5D9] bg-[#F7F4EE] p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-[#8B837A]">
                Platform Overview
              </p>

              <div className="mt-3 flex items-end justify-between">

                <div>
                  <p className="text-3xl font-bold text-[#17392D]">
                    05
                  </p>

                  <p className="mt-1 text-xs text-[#716B64]">
                    Restaurants connected
                  </p>
                </div>

                <Building2
                  size={30}
                  strokeWidth={1.6}
                  className="text-[#B8894D]"
                />

              </div>
            </div>

          </section>
        </div>

      </main>
    </div>
  );
}
