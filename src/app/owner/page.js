"use client";

import { useEffect, useState } from "react";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import { restaurants as initialRestaurants } from "@/data/restaurants";


export default function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState("");
  const [restaurantList, setRestaurantList] = useState(
    initialRestaurants
  );
  const [loading, setLoading] = useState(true);
  const [currentOwnerId, setCurrentOwnerId] = useState(null);



useEffect(() => {
  const fetchOwnerData = async () => {
    try {
      // Get logged-in Owner from secure session cookie
      const response = await fetch("/api/owners/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.owner) {
        window.location.href = "/login";
        return;
      }

    const loggedInOwnerId = data.owner.id || data.owner._id;

      setCurrentOwnerId(loggedInOwnerId);
      setOwner(data.owner);



      // Get only logged-in Owner's restaurants
      const restaurantResponse = await fetch(
        "/api/owners/restaurants",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const restaurantData = await restaurantResponse.json();

      if (!restaurantResponse.ok || !restaurantData.success) {
        throw new Error(
          restaurantData.message || "Unable to fetch restaurants."
        );
      }

      setRestaurantList(restaurantData.restaurants || []);

     

    } catch (error) {
      console.error("Owner dashboard error:", error);
      setError("Unable to load owner details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchOwnerData();
}, []);



  // --------------------------------
  // FILTER OWNER RESTAURANTS
  // --------------------------------


const ownerRestaurants = restaurantList.filter(
  (restaurant) =>
    String(restaurant.ownerId) ===
    String(currentOwnerId)
);

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // --------------------------------
  // OWNER NOT FOUND
  // --------------------------------

  if (!owner) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Owner Not Found
          </h1>

          <p className="mt-2 text-muted-foreground">
            Please login again.
          </p>

          <button
            onClick={() => {
              localStorage.removeItem(
                "loggedInOwnerId"
              );

              window.location.href = "/login";
            }}
            className="mt-5 rounded-lg bg-brand-gold px-5 py-3 font-medium text-brand-espresso"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

return (
<div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F4F0E9]">

    {/* SIDEBAR */}
    <OwnerSidebar />

    {/* MAIN CONTENT */}
   
<main className="min-h-screen w-full min-w-0 max-w-full overflow-x-hidden p-4 pt-20 sm:p-6 lg:ml-64 lg:w-auto lg:p-9">


      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B8792E]">
            Owner Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17231E] sm:text-4xl">
            Welcome, {owner.name}
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#82796E]">
            Manage your restaurants and branches from one place.
          </p>
        </div>

        {/* ADD RESTAURANT */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/owner/restaurants";
          }}
          className="inline-flex items-center justify-center rounded-xl bg-[#D5A454] px-6 py-3 text-sm font-semibold text-[#17231E] shadow-[0_4px_12px_rgba(140,99,39,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C89543] hover:shadow-lg"
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Add Restaurant
        </button>

      </div>


      {/* ================= STATS ================= */}
      <div className="mb-9 grid gap-5 md:grid-cols-3">

        {/* TOTAL */}
        <div className="group relative overflow-hidden rounded-[22px] border border-[#E9DDCB] bg-[#FFFCF8] p-6 shadow-[0_8px_26px_rgba(80,62,38,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8BD91] hover:shadow-[0_14px_32px_rgba(80,62,38,0.08)]">
          <div className="pointer-events-none absolute -right-1 -top-1 h-24 w-24 rounded-bl-[90px] bg-[#F8EFE2]" />

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-semibold text-[#786B59]">
                Total Restaurants
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#26352D]">
                {ownerRestaurants.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E0D5] bg-[#F4F0E9] text-sm font-bold text-[#B38E59]">
              R
            </div>

          </div>

          <p className="mt-4 text-xs leading-5 text-[#8F806D]">
            Restaurants assigned to your account
          </p>
          <div className="mt-5 h-1 w-full rounded-full bg-[#D5A454]" />

        </div>


        {/* ACTIVE */}
        <div className="group relative overflow-hidden rounded-[22px] border border-[#E9DDCB] bg-[#FFFCF8] p-6 shadow-[0_8px_26px_rgba(80,62,38,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8BD91] hover:shadow-[0_14px_32px_rgba(80,62,38,0.08)]">
          <div className="pointer-events-none absolute -right-1 -top-1 h-24 w-24 rounded-bl-[90px] bg-[#E8F1EA]" />

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-semibold text-[#786B59]">
                Active Restaurants
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#26352D]">
                {
                  ownerRestaurants.filter(
                    (restaurant) =>
                      restaurant.status === "Active"
                  ).length
                }
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4E3D5] bg-[#EAF2E9]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3F7D5A]" />
            </div>

          </div>

          <p className="mt-4 text-xs leading-5 text-[#8F806D]">
            Currently operational
          </p>
          <div className="mt-5 h-1 w-full rounded-full bg-[#287B55]" />

        </div>


        {/* INACTIVE */}
        <div className="group relative overflow-hidden rounded-[22px] border border-[#E9DDCB] bg-[#FFFCF8] p-6 shadow-[0_8px_26px_rgba(80,62,38,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8BD91] hover:shadow-[0_14px_32px_rgba(80,62,38,0.08)]">
          <div className="pointer-events-none absolute -right-1 -top-1 h-24 w-24 rounded-bl-[90px] bg-[#F8EAEA]" />

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-semibold text-[#786B59]">
                Inactive Restaurants
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#26352D]">
                {
                  ownerRestaurants.filter(
                    (restaurant) =>
                      restaurant.status === "Inactive"
                  ).length
                }
              </h2>
            </div>

<div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#EED9D5] bg-[#F8ECE9]">
  <span className="h-2.5 w-2.5 rounded-full bg-[#C85C5C]" />
</div>

          </div>

          <p className="mt-4 text-xs leading-5 text-[#8F806D]">
            Currently unavailable
          </p>
          <div className="mt-5 h-1 w-full rounded-full bg-[#D74747]" />

        </div>

      </div>


      {/* ================= RESTAURANTS ================= */}
      <div>

        {/* SECTION HEADER */}
        <div className="mb-5 flex items-end justify-between gap-4">

          <div>
         <h2 className="border-l-4 border-[#D5A454] pl-3 text-xl font-bold tracking-tight text-[#17231E]">
              Your Restaurants
            </h2>

        <p className="mt-1 text-sm leading-6 text-[#827C72]">
              Restaurants and branches assigned to your account.
            </p>
          </div>

         <span className="hidden rounded-full border border-[#E8DCCB] bg-[#FBF7F0] px-3 py-1.5 text-xs font-semibold text-[#806F59] sm:block">
            {ownerRestaurants.length}{" "}
            {ownerRestaurants.length === 1
              ? "Restaurant"
              : "Restaurants"}
          </span>

        </div>


        {/* ================= NO RESTAURANTS ================= */}
        {ownerRestaurants.length === 0 ? (

        <div className="rounded-[22px] border border-dashed border-[#DCCDB8] bg-[#FBF7F0] px-6 py-16 text-center shadow-[0_8px_26px_rgba(80,62,38,0.03)]">

           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E8E0D5] bg-[#F4F0E9] text-xl font-bold text-[#B38E59] shadow-sm">
              R
            </div>

          <h3 className="mt-5 font-serif text-xl font-semibold text-[#252721]">
              No Restaurants Found
            </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#827C72]">
              No restaurant or branch has been assigned to your
              account yet.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/owner/restaurants";
              }}
             className="mt-6 rounded-xl bg-[#D5A454] px-5 py-3 text-sm font-semibold text-[#2D281F] shadow-[0_4px_12px_rgba(140,99,39,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C89543] hover:shadow-lg"
            >
              View Restaurants
            </button>

          </div>

        ) : (

          /* ================= RESTAURANT CARDS ================= */
         
<div className="grid w-full min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">


            {ownerRestaurants.map((restaurant) => (

              <div
                key={restaurant.id}
               
className="group relative w-full min-w-0 overflow-hidden rounded-[22px] border border-[#E9DDCB] bg-[#FFFCF8] p-4 shadow-[0_8px_26px_rgba(80,62,38,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8BD91] hover:shadow-[0_16px_34px_rgba(80,62,38,0.085)] sm:p-6"

              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C9974E] via-[#E4C795] to-[#C9974E]" />

                {/* TOP */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    {/* RESTAURANT AVATAR */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#003D32] text-base font-bold text-[#E2B45F] shadow-sm">
                      {restaurant.name
                        ?.charAt(0)
                        ?.toUpperCase() || "R"}
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-lg font-semibold tracking-tight text-[#252721]">
                        {restaurant.name}
                      </h3>

                      <p className="mt-1 truncate text-xs font-medium tracking-wide text-[#958777]">
                        Restaurant ID: {restaurant.id}
                      </p>

                    </div>

                  </div>


                  {/* STATUS */}
                  <span
className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
  restaurant.status === "Active"
    ? "border-[#D7E7DA] bg-[#EDF5EE] text-[#3F7652]"
    : "border-[#F0DADA] bg-[#FCF0EF] text-[#B85B55]"
}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                      restaurant.status === "Active"
                      ? "bg-[#3F7652]"
                      : "bg-[#B85B55]"}`}
                    />

                    {restaurant.status}
                  </span>

                </div>


                {/* LOCATION */}
                <div className="mt-5 rounded-2xl border border-[#EFE5D9] bg-[#F7F3ED] px-4 py-3.5">

                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A87937]">
                    Location
                  </p>

<p className="mt-1 text-sm font-medium leading-6 text-[#17231E]">
  {restaurant.location ||
    [restaurant.city, restaurant.state]
      .filter(Boolean)
      .join(", ") ||
    "Location not available"}
</p>

                </div>


                {/* FOOTER */}
              <div className="mt-5 flex items-center justify-between border-t border-[#EEE4D8] pt-4">

               <span className="text-xs font-medium tracking-wide text-[#958777]">
                    Manage restaurant
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href =
                        `/owner/restaurants/${restaurant.id}`;
                    }}
                 className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#B38E59] transition-all duration-200 hover:bg-[#F4F0E9] hover:text-[#102D26]"
                  >
                    View Details
                    <span className="text-base transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>

  </div>
);
}