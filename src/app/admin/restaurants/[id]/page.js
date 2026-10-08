"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function RestaurantDetails({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subBranches, setSubBranches] = useState([]);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      const { id } = await params;

      const savedRestaurants =
        localStorage.getItem("restaurants");

      if (savedRestaurants) {
        const restaurantList =
          JSON.parse(savedRestaurants);

        const foundRestaurant = restaurantList.find(
          (item) => item.id === Number(id)
        );

        setRestaurant(foundRestaurant || null);

        if (foundRestaurant) {
          const branches = restaurantList.filter(
            (item) =>
              String(item.parentRestaurantId) ===
              String(foundRestaurant.id)
          );

          setSubBranches(branches);

          // Load Owner
          const savedOwners =
            localStorage.getItem("owners");

          if (savedOwners) {
            const owners = JSON.parse(savedOwners);

            const foundOwner = owners.find(
              (item) =>
                String(item.id) ===
                String(foundRestaurant.ownerId)
            );

            setOwner(foundOwner || null);
          }
        }
      }

      setLoading(false);
    };

    loadRestaurant();
  }, [params]);

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
     <div className="flex min-h-screen bg-background">
        <AdminSidebar />

  <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Loading Restaurant...
          </h1>
        </main>
      </div>
    );
  }

  // -----------------------------
  // RESTAURANT NOT FOUND
  // -----------------------------

  if (!restaurant) {
    return (
    <div className="min-h-screen bg-background">
        <AdminSidebar />

      <main className="ml-64 min-w-0 p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Restaurant Not Found
          </h1>

          <p className="mt-2 text-muted-foreground">
            The restaurant you are looking for does not exist.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">

      {/* ==============================
          SIDEBAR
      ============================== */}
      <AdminSidebar />

      {/* ==============================
          MAIN CONTENT
      ============================== */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        {/* PAGE TITLE */}
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Restaurant Details
        </h1>

        {/* ==============================
            RESTAURANT CARD
        ============================== */}
        <div className="mt-6 sm:mt-8 overflow-hidden rounded-xl border bg-card shadow-premium">

          {/* IMAGE */}
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-48 sm:h-64 lg:h-80 w-full object-cover"
          />

          {/* CONTENT */}
          <div className="p-4 sm:p-6">

            <h2 className="text-xl sm:text-2xl font-semibold break-words">
              {restaurant.name}
            </h2>

            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Restaurant Details
            </p>

            {/* RESTAURANT INFORMATION */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* Restaurant ID */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Restaurant ID
                </p>

                <p className="mt-1 font-medium break-all">
                  {restaurant.id}
                </p>
              </div>

              {/* Location */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Location
                </p>

                <p className="mt-1 font-medium break-words">
                  {restaurant.location || "—"}
                </p>
              </div>

              {/* Address */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Address
                </p>

                <p className="mt-1 font-medium break-words">
                  {restaurant.address || "—"}
                </p>
              </div>

              {/* City */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  City
                </p>

                <p className="mt-1 font-medium break-words">
                  {restaurant.city || "—"}
                </p>
              </div>

              {/* State */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  State
                </p>

                <p className="mt-1 font-medium break-words">
                  {restaurant.state || "—"}
                </p>
              </div>

              {/* Pincode */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Pincode
                </p>

                <p className="mt-1 font-medium">
                  {restaurant.pincode || "—"}
                </p>
              </div>

              {/* Email */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Email
                </p>

                <p className="mt-1 font-medium break-all">
                  {restaurant.email || "—"}
                </p>
              </div>

              {/* Mobile */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Mobile Number
                </p>

                <p className="mt-1 font-medium">
                  {restaurant.phone || "—"}
                </p>
              </div>

              {/* GST */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  GST Number
                </p>

                <p className="mt-1 font-medium break-all">
                  {restaurant.gstNumber || "—"}
                </p>
              </div>

              {/* Status */}
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 font-medium">
                  {restaurant.status || "—"}
                </p>
              </div>

            </div>

            {/* ==============================
                OWNER
            ============================== */}
            <div className="mt-8 border-t pt-6">

              <h3 className="text-lg sm:text-xl font-semibold">
                Owner
              </h3>

              <div className="mt-4 rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Owner Name
                </p>

                <p className="mt-1 font-medium break-words">
                  {owner?.name || "—"}
                </p>
              </div>

            </div>

            {/* ==============================
                OTHER BRANCHES
            ============================== */}
            {subBranches.length > 0 && (
              <div className="mt-8 border-t pt-6">

                <div className="mb-5">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Other Branches
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    View and manage other branches of this
                    restaurant.
                  </p>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-xl border bg-white">

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                      <thead>
                        <tr className="border-b bg-[#FCFAF7]">

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8B837A]">
                            S.No.
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8B837A]">
                            Restaurant
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8B837A]">
                            Location
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8B837A]">
                            Email
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8B837A]">
                            Status
                          </th>

                          <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#8B837A]">
                            Action
                          </th>

                        </tr>
                      </thead>

                      <tbody>

                        {subBranches.map((branch, index) => (
                          <tr
                            key={branch.id}
                            className="border-b border-[#EEE8DF] last:border-b-0 hover:bg-[#FCFAF7]"
                          >

                            {/* S.No. */}
                            <td className="px-6 py-5">
                              <span className="text-sm font-medium text-[#9A9289]">
                                {String(index + 1).padStart(
                                  2,
                                  "0"
                                )}
                              </span>
                            </td>

                            {/* Restaurant */}
                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D4] text-sm font-bold text-[#B88945]">
                                  {branch.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "R"}
                                </div>

                                <div>
                                  <p className="text-sm font-semibold text-[#171411]">
                                    {branch.name}
                                  </p>

                                  <p className="mt-1 text-xs text-[#9A9289]">
                                    Restaurant ID:{" "}
                                    {branch.id}
                                  </p>
                                </div>

                              </div>

                            </td>

                            {/* Location */}
                            <td className="px-6 py-5">

                              <p className="text-sm text-[#4F4942]">
                                {branch.location ||
                                  [
                                    branch.city,
                                    branch.state,
                                  ]
                                    .filter(Boolean)
                                    .join(", ") ||
                                  "—"}
                              </p>

                            </td>

                            {/* Email */}
                            <td className="px-6 py-5">

                              <p className="text-sm text-[#4F4942] break-all">
                                {branch.email || "—"}
                              </p>

                            </td>

                            {/* Status */}
                            <td className="px-6 py-5">

                              <span
                                className={
                                  branch.status ===
                                  "Active"
                                    ? "inline-flex items-center gap-2 rounded-full bg-[#E8F2EB] px-3 py-1.5 text-xs font-semibold text-[#3F7D5A]"
                                    : "inline-flex items-center gap-2 rounded-full bg-[#FBEAEA] px-3 py-1.5 text-xs font-semibold text-[#C85C5C]"
                                }
                              >

                                <span
                                  className={
                                    branch.status ===
                                    "Active"
                                      ? "h-1.5 w-1.5 rounded-full bg-[#3F7D5A]"
                                      : "h-1.5 w-1.5 rounded-full bg-[#C85C5C]"
                                  }
                                />

                                {branch.status || "—"}

                              </span>

                            </td>

                            {/* Action */}
                            <td className="px-6 py-5">

                              <div className="flex items-center justify-end">

                                <a
                                  href={`/admin/restaurants/${branch.id}`}
                                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#B88945] transition hover:bg-[#F5E8D4] hover:text-[#171411]"
                                >
                                  View
                                </a>

                              </div>

                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}