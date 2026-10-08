"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  ClipboardList,
  LayoutDashboard,
  QrCode,
  Store,
  Table2,
  Users,
  Utensils,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-[-200px] top-20 h-[500px] w-[500px] rounded-full bg-[#D5A960]/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-20">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="relative z-10">

          {/* Small Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8B77F] bg-[#FBF8F2] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#936A2D]">
            <span className="h-2 w-2 rounded-full bg-[#C99A52]" />
            All-in-one restaurant management
          </div>


          {/* Heading */}
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[68px]">

            Everything Your
            <span className="block">
              Restaurant Needs.
            </span>

            <span className="block text-[#C3954F]">
              In One Place.
            </span>

          </h1>


          {/* Description */}
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#6D665E]">
            Manage restaurants, branches, menus, tables, QR ordering,
            managers and orders — all from one powerful platform.
          </p>


          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D5A960] px-6 py-4 text-sm font-semibold text-[#171411] shadow-lg shadow-[#C99A52]/10 transition hover:-translate-y-0.5 hover:bg-[#C99A52]"
            >
              Login to Dashboard
              <ArrowRight size={17} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8D0C4] bg-white px-6 py-4 text-sm font-semibold transition hover:bg-[#F1ECE4]"
            >
              Explore Features
            </a>

          </div>


          {/* Small Benefits */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#756E66]">

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5D936D]" />
              Multi-restaurant
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5D936D]" />
              QR ordering
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5D936D]" />
              Real-time orders
            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT — DASHBOARD PREVIEW
        ===================================================== */}

        <div className="relative">

          {/* Glow */}
          <div className="absolute inset-8 rounded-[40px] bg-[#D5A960]/20 blur-3xl" />


          {/* Browser Window */}
          <div className="relative overflow-hidden rounded-[24px] border border-[#D8D0C4] bg-white shadow-2xl shadow-black/10">

            {/* Browser Header */}
            <div className="flex h-11 items-center gap-2 border-b border-[#E8E2D9] bg-[#FAF8F4] px-4">

              <span className="h-2.5 w-2.5 rounded-full bg-[#D8C5A6]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D8C5A6]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D8C5A6]" />

              <div className="ml-5 h-6 flex-1 rounded-md border border-[#E5DED4] bg-white" />

            </div>


            {/* Dashboard */}
            <div className="grid min-h-[440px] grid-cols-[125px_1fr]">

              {/* ---------------------------------------------
                  MINI SIDEBAR
              --------------------------------------------- */}

              <div className="bg-[#151210] p-4 text-white">

                <div className="mb-7 text-sm font-semibold">
                  Restaurant
                  <span className="text-[#D5A960]">OS</span>
                </div>


                <div className="space-y-2">

                  <MiniNav
                    icon={LayoutDashboard}
                    text="Dashboard"
                    active
                  />

                  <MiniNav
                    icon={Store}
                    text="Restaurants"
                  />

                  <MiniNav
                    icon={Users}
                    text="Managers"
                  />

                  <MiniNav
                    icon={Utensils}
                    text="Menu"
                  />

                  <MiniNav
                    icon={Table2}
                    text="Tables"
                  />

                  <MiniNav
                    icon={QrCode}
                    text="QR Codes"
                  />

                  <MiniNav
                    icon={ClipboardList}
                    text="Orders"
                  />

                </div>

              </div>


              {/* ---------------------------------------------
                  DASHBOARD CONTENT
              --------------------------------------------- */}

              <div className="bg-[#F8F5EF] p-5">

                {/* Header */}
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] text-[#8A8278]">
                      Admin Dashboard
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Overview
                    </h3>

                  </div>


                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <Bell size={14} />
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D5A960] text-xs font-bold">
                      A
                    </div>

                  </div>

                </div>


                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

                  <DashboardStat
                    title="Restaurants"
                    value="05"
                  />

                  <DashboardStat
                    title="Active"
                    value="03"
                  />

                  <DashboardStat
                    title="Managers"
                    value="03"
                  />

                  <DashboardStat
                    title="Orders"
                    value="248"
                  />

                </div>


                {/* Restaurant List */}
                <div className="mt-5 rounded-xl border border-[#E5DED4] bg-white p-4">

                  <div className="flex items-center justify-between">

                    <h4 className="text-sm font-semibold">
                      Recent Restaurants
                    </h4>

                    <span className="text-[10px] text-[#A09589]">
                      View all
                    </span>

                  </div>


                  <div className="mt-4 space-y-3">

                    <DashboardRestaurant
                      name="Desi Kitchen"
                      location="Gurgaon"
                      active
                    />

                    <DashboardRestaurant
                      name="Spice Route"
                      location="Delhi"
                      active
                    />

                    <DashboardRestaurant
                      name="Punjabi Dhaba"
                      location="Gurgaon"
                    />

                  </div>

                </div>


                {/* Small Chart */}
                <div className="mt-4 hidden rounded-xl border border-[#E5DED4] bg-white p-4 sm:block">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[9px] text-[#8A8278]">
                        Today's Orders
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        32
                      </p>

                    </div>

                    <BarChart3
                      size={20}
                      className="text-[#B88437]"
                    />

                  </div>


                  <div className="mt-4 flex h-10 items-end gap-1">

                    <ChartBar height="35%" />
                    <ChartBar height="55%" />
                    <ChartBar height="42%" />
                    <ChartBar height="72%" />
                    <ChartBar height="58%" />
                    <ChartBar height="85%" />
                    <ChartBar height="65%" />
                    <ChartBar height="92%" />

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Floating QR Card */}
          <div className="absolute -bottom-8 -right-5 hidden w-40 rounded-2xl border border-[#E3D9CB] bg-white p-4 shadow-xl sm:block">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] text-[#91887D]">
                  TABLE
                </p>

                <p className="text-sm font-semibold">
                  Table 05
                </p>

              </div>

              <QrCode
                size={25}
                className="text-[#B88437]"
              />

            </div>


            <div className="mt-3 flex items-center justify-center rounded-xl bg-[#F6F1E9] py-5">

              <QrCode
                size={70}
                strokeWidth={1.4}
              />

            </div>


            <p className="mt-2 text-center text-[9px] text-[#81796F]">
              Scan • Explore • Order
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}


/* ============================================================
   MINI NAV
============================================================ */

function MiniNav({
  icon: Icon,
  text,
  active = false,
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[9px] ${
        active
          ? "bg-[#D5A960] text-[#171411]"
          : "text-[#AFA79D]"
      }`}
    >
      <Icon size={12} />
      <span>{text}</span>
    </div>
  );
}


/* ============================================================
   DASHBOARD STAT
============================================================ */

function DashboardStat({
  title,
  value,
}) {
  return (
    <div className="rounded-lg border border-[#E7E0D6] bg-white p-3">

      <p className="text-[9px] text-[#8A8278]">
        {title}
      </p>

      <p className="mt-1 text-xl font-semibold">
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   RESTAURANT ROW
============================================================ */

function DashboardRestaurant({
  name,
  location,
  active = false,
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-3 last:border-0 last:pb-0">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F6F0E7]">
          <Store
            size={14}
            className="text-[#B88437]"
          />
        </div>

        <div>

          <p className="text-[11px] font-semibold">
            {name}
          </p>

          <p className="text-[9px] text-[#958B80]">
            {location}
          </p>

        </div>

      </div>


      <span
        className={`rounded-full px-2 py-1 text-[8px] font-medium ${
          active
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-600"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </span>

    </div>
  );
}


/* ============================================================
   CHART BAR
============================================================ */

function ChartBar({ height }) {
  return (
    <div
      className="flex-1 rounded-t bg-[#D5A960]"
      style={{ height }}
    />
  );
}