"use client";

import { useEffect, useState } from "react";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import { restaurants as initialRestaurants } from "@/data/restaurants";


export default function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [restaurantList, setRestaurantList] = useState(
    initialRestaurants
  );
  const [loading, setLoading] = useState(true);
  const [currentOwnerId, setCurrentOwnerId] = useState(null);

  useEffect(() => {
    // --------------------------------
    // GET LOGGED-IN OWNER ID
    // --------------------------------

    const loggedInOwnerId =
      localStorage.getItem("loggedInOwnerId");

    if (!loggedInOwnerId) {
      window.location.href = "/login";
      return;
    }

    setCurrentOwnerId(loggedInOwnerId);

    // --------------------------------
    // GET OWNER DATA
    // --------------------------------

    const savedOwners = localStorage.getItem("owners");

    if (savedOwners) {
      const ownerList = JSON.parse(savedOwners);

      const loggedInOwner = ownerList.find(
        (item) =>
          String(item.id) === String(loggedInOwnerId)
      );

      if (loggedInOwner) {
        setOwner(loggedInOwner);
      }
    }

    // --------------------------------
    // GET RESTAURANTS
    // --------------------------------

    const savedRestaurants =
      localStorage.getItem("restaurants");

    if (savedRestaurants) {
      setRestaurantList(JSON.parse(savedRestaurants));
    }

    setLoading(false);
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
  <div className="min-h-screen bg-[#F7F4EE]">

    {/* SIDEBAR */}
    <OwnerSidebar />

    {/* MAIN CONTENT */}
    <main className="ml-64 min-h-screen p-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#B88945]">
            Owner Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171411]">
            Welcome, {owner.name}
          </h1>

          <p className="mt-2 text-sm text-[#716B64]">
            Manage your restaurants and branches from one place.
          </p>
        </div>

        {/* ADD RESTAURANT */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/owner/restaurants";
          }}
          className="inline-flex items-center justify-center rounded-xl bg-[#D5A960] px-5 py-3 text-sm font-semibold text-[#171411] shadow-sm transition hover:bg-[#C99A52] hover:shadow-md"
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Add Restaurant
        </button>

      </div>


      {/* ================= STATS ================= */}
      <div className="mb-8 grid gap-5 md:grid-cols-3">

        {/* TOTAL */}
        <div className="rounded-2xl border border-[#E5DED4] bg-white p-6 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-[#716B64]">
                Total Restaurants
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#171411]">
                {ownerRestaurants.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E8D4] text-sm font-bold text-[#B88945]">
              R
            </div>

          </div>

          <p className="mt-4 text-xs text-[#9A9289]">
            Restaurants assigned to your account
          </p>

        </div>


        {/* ACTIVE */}
        <div className="rounded-2xl border border-[#E5DED4] bg-white p-6 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-[#716B64]">
                Active Restaurants
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#171411]">
                {
                  ownerRestaurants.filter(
                    (restaurant) =>
                      restaurant.status === "Active"
                  ).length
                }
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F2EB]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3F7D5A]" />
            </div>

          </div>

          <p className="mt-4 text-xs text-[#9A9289]">
            Currently operational
          </p>

        </div>


        {/* INACTIVE */}
        <div className="rounded-2xl border border-[#E5DED4] bg-white p-6 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-[#716B64]">
                Inactive Restaurants
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#171411]">
                {
                  ownerRestaurants.filter(
                    (restaurant) =>
                      restaurant.status === "Inactive"
                  ).length
                }
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FBEAEA]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C85C5C]" />
            </div>

          </div>

          <p className="mt-4 text-xs text-[#9A9289]">
            Currently unavailable
          </p>

        </div>

      </div>


      {/* ================= RESTAURANTS ================= */}
      <div>

        {/* SECTION HEADER */}
        <div className="mb-5 flex items-end justify-between">

          <div>
            <h2 className="text-xl font-bold text-[#171411]">
              Your Restaurants
            </h2>

            <p className="mt-1 text-sm text-[#716B64]">
              Restaurants and branches assigned to your account.
            </p>
          </div>

          <span className="hidden text-sm text-[#716B64] sm:block">
            {ownerRestaurants.length}{" "}
            {ownerRestaurants.length === 1
              ? "Restaurant"
              : "Restaurants"}
          </span>

        </div>


        {/* ================= NO RESTAURANTS ================= */}
        {ownerRestaurants.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-[#D8CFC4] bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5E8D4] text-xl font-bold text-[#B88945]">
              R
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#171411]">
              No Restaurants Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#716B64]">
              No restaurant or branch has been assigned to your
              account yet.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/owner/restaurants";
              }}
              className="mt-6 rounded-xl bg-[#D5A960] px-5 py-2.5 text-sm font-semibold text-[#171411] transition hover:bg-[#C99A52]"
            >
              View Restaurants
            </button>

          </div>

        ) : (

          /* ================= RESTAURANT CARDS ================= */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {ownerRestaurants.map((restaurant) => (

              <div
                key={restaurant.id}
                className="group rounded-2xl border border-[#E5DED4] bg-white p-6 shadow-[0_8px_30px_rgba(23,20,17,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(23,20,17,0.08)]"
              >

                {/* TOP */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    {/* RESTAURANT AVATAR */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D4] text-base font-bold text-[#B88945]">
                      {restaurant.name
                        ?.charAt(0)
                        ?.toUpperCase() || "R"}
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-base font-bold text-[#171411]">
                        {restaurant.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#9A9289]">
                        Restaurant ID: {restaurant.id}
                      </p>

                    </div>

                  </div>


                  {/* STATUS */}
                  <span
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      restaurant.status === "Active"
                        ? "bg-[#E8F2EB] text-[#3F7D5A]"
                        : "bg-[#FBEAEA] text-[#C85C5C]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        restaurant.status === "Active"
                          ? "bg-[#3F7D5A]"
                          : "bg-[#C85C5C]"
                      }`}
                    />

                    {restaurant.status}
                  </span>

                </div>


                {/* LOCATION */}
                <div className="mt-6 rounded-xl bg-[#FCFAF7] px-4 py-3">

                  <p className="text-xs font-medium uppercase tracking-wider text-[#9A9289]">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#4F4942]">
                    {restaurant.location ||
                      [restaurant.city, restaurant.state]
                        .filter(Boolean)
                        .join(", ") ||
                      "Location not available"}
                  </p>

                </div>


                {/* FOOTER */}
                <div className="mt-5 flex items-center justify-between border-t border-[#EEE8DF] pt-5">

                  <span className="text-xs text-[#9A9289]">
                    Manage restaurant
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href =
                        `/owner/restaurants/${restaurant.id}`;
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#B88945] transition hover:bg-[#F5E8D4] hover:text-[#171411]"
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