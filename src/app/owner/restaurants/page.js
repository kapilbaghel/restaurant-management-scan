"use client";


import { useEffect, useState } from "react";
import { City, State } from "country-state-city";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import { restaurants as initialRestaurants } from "@/data/restaurants";

export default function OwnerRestaurants() {
  const [restaurantList, setRestaurantList] =
    useState(initialRestaurants);
   
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentOwnerId, setCurrentOwnerId] = useState(null);
  const [managerList, setManagerList] = useState([]);
  const [managerSearch, setManagerSearch] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

   const indiaStates = State.getStatesOfCountry("IN");

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    status: "Active",
    managerId: "",
  });

const validateEmail = (email) => {
  if (!email.trim()) {
    return "";
  }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(email)) {
    return "Invalid email ID — please enter a valid email with a domain.";
  }

  return "";
};

  // --------------------------------
  // GET LOGGED-IN OWNER
  // --------------------------------

  useEffect(() => {
    const loggedInOwnerId =
      localStorage.getItem("loggedInOwnerId");

    // Owner login nahi hai
    if (!loggedInOwnerId) {
      window.location.href = "/login";
      return;
    }

    // Logged-in owner ID save karo
    setCurrentOwnerId(loggedInOwnerId);

    // Restaurants load karo
    const savedRestaurants =
      localStorage.getItem("restaurants");

    if (savedRestaurants) {
      setRestaurantList(
        JSON.parse(savedRestaurants)
      );
    }

    // Managers load karo
const savedManagers = localStorage.getItem("managers");

if (savedManagers) {
  setManagerList(JSON.parse(savedManagers));
}
  }, []);

  // --------------------------------
  // OWNER RESTAURANTS
  // --------------------------------

  const ownerRestaurants = restaurantList.filter(
    (restaurant) =>
      String(restaurant.ownerId) ===
      String(currentOwnerId)
  );

  // --------------------------------
  // CREATE RESTAURANT
  // --------------------------------

  const handleCreateRestaurant = () => {
    // Owner ID available nahi hai
    if (!currentOwnerId) {
      alert("Owner session not found. Please login again.");
      window.location.href = "/login";
      return;
    }

    // Restaurant name validation
    if (!restaurantForm.name.trim()) {
      alert("Please enter restaurant name.");
      return;
    }

    // Location validation
    if (!restaurantForm.location.trim()) {
      alert("Please enter restaurant location.");
      return;
    }

      // Email validation
  const emailValidationError = validateEmail(restaurantForm.email);

  if (emailValidationError) {
    setEmailError(emailValidationError);
    return;
  }



const sameNameRestaurants = restaurantList.filter(
  (restaurant) =>
    String(restaurant.ownerId) === String(currentOwnerId) &&
    restaurant.name.trim().toLowerCase() ===
      restaurantForm.name.trim().toLowerCase()
);

const mainBranch = sameNameRestaurants.find(
  (restaurant) => restaurant.branchType === "main"
);

const branchType =
  sameNameRestaurants.length === 0 ? "main" : "sub";

const parentRestaurantId =
  branchType === "main"
    ? null
    : mainBranch?.id || sameNameRestaurants[0]?.id;


// RESTAURANT IMAGE
const restaurantImage =
  branchType === "sub"
    ? mainBranch?.image
    : "/restaurants/the-traditional-taste/hero.jpg";


// New restaurant
const newRestaurant = {
  id: Date.now(),

  name: restaurantForm.name,
  location: restaurantForm.location,

  phone: restaurantForm.phone,
  email: restaurantForm.email,

  address: restaurantForm.address,
  state: restaurantForm.state,
  city: restaurantForm.city,
  pincode: restaurantForm.pincode,

  status: restaurantForm.status,

  // BRANCH MANAGER
  managerId: restaurantForm.managerId,

  // IMPORTANT:
  // Logged-in owner ki ID
  ownerId: Number(currentOwnerId),

  // BRANCH INFORMATION
  branchType,
  parentRestaurantId,

  // RESTAURANT IMAGE
image:
  branchType === "sub"
    ? mainBranch?.image || "/restaurants/the-traditional-taste/hero.jpg"
    : "/restaurants/the-traditional-taste/hero.jpg",

};

    // Latest restaurant list
    const updatedRestaurants = [
      ...restaurantList,
      newRestaurant,
    ];

    // React state update
    setRestaurantList(updatedRestaurants);

    // LocalStorage update
    localStorage.setItem(
      "restaurants",
      JSON.stringify(updatedRestaurants)
    );

    // Modal close
    setIsModalOpen(false);

    // Form reset
    setRestaurantForm({
      name: "",
      location: "",
      phone: "",
      email: "",
      address: "",
      state: "",
      city: "",
      pincode: "",
      status: "Active",
        managerId: "",
    });
    setEmailError("");

  };

  // --------------------------------
  // DEBUG
  // --------------------------------

  console.log(
    "LOGGED IN OWNER ID:",
    currentOwnerId
  );

  console.log(
    "ALL RESTAURANTS:",
    restaurantList
  );

  console.log(
    "OWNER RESTAURANTS:",
    ownerRestaurants
  );

  return (
    <div className="min-h-screen bg-background">

      {/* SIDEBAR */}
      <OwnerSidebar />

      {/* MAIN CONTENT */}
     <main className="ml-64 min-h-screen bg-[#F7F4EE] p-8">

  {/* ================= HEADER ================= */}
  <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#B88945]">
        Restaurant Management
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171411]">
        My Restaurants
      </h1>

      <p className="mt-2 text-sm text-[#716B64]">
        Manage your restaurants and branches from one place.
      </p>
    </div>

    {/* ADD RESTAURANT */}
    <button
      type="button"
      onClick={() => setIsModalOpen(true)}
      className="inline-flex items-center justify-center rounded-xl bg-[#D5A960] px-5 py-3 text-sm font-semibold text-[#171411] shadow-sm transition hover:bg-[#C99A52] hover:shadow-md"
    >
      <span className="mr-2 text-lg leading-none">
        +
      </span>

      Add Restaurant
    </button>

  </div>


  {/* ================= SUMMARY ================= */}
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
        Restaurants assigned to you
      </p>

    </div>


    {/* ACTIVE */}
    <div className="rounded-2xl border border-[#E5DED4] bg-white p-6 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-[#716B64]">
            Active
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
            Inactive
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


  {/* ================= RESTAURANT LIST ================= */}
  <section>

    {/* SECTION HEADER */}
    <div className="mb-5 flex items-end justify-between">

      <div>
        <h2 className="text-xl font-bold text-[#171411]">
          Restaurant List
        </h2>

        <p className="mt-1 text-sm text-[#716B64]">
          View and manage all restaurants assigned to your account.
        </p>
      </div>

      <span className="hidden text-sm text-[#716B64] sm:block">
        {ownerRestaurants.length}{" "}
        {ownerRestaurants.length === 1
          ? "Restaurant"
          : "Restaurants"}
      </span>

    </div>


    {/* ================= EMPTY STATE ================= */}
    {ownerRestaurants.length === 0 ? (

      <div className="rounded-2xl border border-dashed border-[#D8CFC4] bg-white px-6 py-16 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5E8D4] text-xl font-bold text-[#B88945]">
          R
        </div>

        <h3 className="mt-5 text-lg font-bold text-[#171411]">
          No Restaurants Found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#716B64]">
          You do not have any restaurants assigned to your
          account yet. Create your first restaurant to get started.
        </p>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-6 rounded-xl bg-[#D5A960] px-5 py-2.5 text-sm font-semibold text-[#171411] transition hover:bg-[#C99A52]"
        >
          + Add Restaurant
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

                {/* AVATAR */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D4] text-base font-bold text-[#B88945]">
                  {restaurant.name
                    ?.charAt(0)
                    ?.toUpperCase() || "R"}
                </div>

                <div className="min-w-0">

                  <h3 className="truncate text-base font-bold text-[#171411]">
                    {restaurant.name}
                  </h3>

<p className="mt-1 text-xs font-semibold text-[#B88945]">
  {restaurant.city || "Location"}{" "}
  {restaurant.branchType === "main" || !restaurant.branchType
    ? "(Main Branch)"
    : "Branch"}
</p>

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


            {/* RESTAURANT DETAILS */}
            <div className="mt-6 space-y-3">

              {/* LOCATION */}
              <div className="rounded-xl bg-[#FCFAF7] px-4 py-3">

                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
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


              {/* CONTACT */}
              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-[#EEE8DF] px-4 py-3">

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                    Phone
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-[#4F4942]">
                    {restaurant.phone || "Not added"}
                  </p>

                </div>


                <div className="rounded-xl border border-[#EEE8DF] px-4 py-3">

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                    Email
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-[#4F4942]">
                    {restaurant.email || "Not added"}
                  </p>

                </div>

              </div>

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

  </section>

</main>

      {/* ===================================== */}
      {/* ADD RESTAURANT MODAL */}
      {/* ===================================== */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-card shadow-xl">

            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b px-7 py-5">

              <div>

                <h2 className="text-2xl font-semibold">
                  Add Restaurant
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create a new restaurant
                </p>

              </div>

              {/* CLOSE */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xl text-muted-foreground hover:text-foreground"
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}
            <div className="max-h-[calc(90vh-100px)] overflow-y-auto">

              <div className="px-7 py-6">

                {/* ROW 1 */}
                <div className="grid grid-cols-2 gap-5">

                  {/* RESTAURANT NAME */}
                  <div>

                    <label className="text-sm font-medium">
                      Restaurant Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter restaurant name"
                      value={restaurantForm.name}
                      onChange={(e) =>
                        setRestaurantForm({
                          ...restaurantForm,
                          name: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
                    />

                  </div>

                  {/* LOCATION */}
                  <div>

                    <label className="text-sm font-medium">
                      Location
                    </label>

                    <input
                      type="text"
                      placeholder="Enter restaurant location"
                      value={restaurantForm.location}
                      onChange={(e) =>
                        setRestaurantForm({
                          ...restaurantForm,
                          location: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
                    />

                  </div>

                </div>

                {/* ROW 2 */}
                <div className="mt-5 grid grid-cols-2 gap-5">

                  {/* PHONE */}
                  <div>

                    <label className="text-sm font-medium">
                      Phone
                    </label>

                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={restaurantForm.phone}
                      onChange={(e) =>
                        setRestaurantForm({
                          ...restaurantForm,
                          phone: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
                    />

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label className="text-sm font-medium">
                      Email
                    </label>

<input
  type="email"
  placeholder="Enter email address"
  value={restaurantForm.email}
  onChange={(e) => {
    const email = e.target.value;

    setRestaurantForm({
      ...restaurantForm,
      email,
    });

    setEmailError(validateEmail(email));
  }}
  className={`mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 ${
    emailError
      ? "border-red-500 focus:ring-red-200"
      : "focus:ring-brand-gold"
  }`}
/>

{emailError && (
  <p className="mt-2 text-sm text-red-500">
    ⚠ {emailError}
  </p>
)}

                  </div>

                </div>

                {/* ADDRESS */}
                <div className="mt-5">

                  <label className="text-sm font-medium">
                    Address
                  </label>

                  <textarea
                    placeholder="Enter complete restaurant address"
                    value={restaurantForm.address}
                    onChange={(e) =>
                      setRestaurantForm({
                        ...restaurantForm,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    className="mt-2 w-full resize-none rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"
                  />

                </div>

                {/* ROW 3 */}
                <div className="mt-5 grid grid-cols-2 gap-5">

                  {/* STATE */}
<div className="relative">
  <label className="text-sm font-medium">
    State
  </label>

  <input
    type="text"
    placeholder="Search state"
    value={restaurantForm.state || stateSearch}
    onChange={(e) => {
      setStateSearch(e.target.value);

      setRestaurantForm({
        ...restaurantForm,
        state: "",
      });
    }}
    className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
  />

  {stateSearch && (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
      {indiaStates
        .filter((state) =>
          state.name
            .toLowerCase()
            .includes(stateSearch.toLowerCase())
        )
        .slice(0, 10)
        .map((state) => (
          <button
            key={state.isoCode}
            type="button"
            onClick={() => {
              setRestaurantForm({
                ...restaurantForm,
                state: state.name,
              });

              setStateSearch("");
            }}
            className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F5E8D4]"
          >
            {state.name}
          </button>
        ))}
    </div>
  )}
</div>

                  {/* CITY */}
<div className="relative">
  <label className="text-sm font-medium">
    City
  </label>

  <input
    type="text"
    placeholder={
      restaurantForm.state
        ? "Search city"
        : "Select state first"
    }
    value={restaurantForm.city || citySearch}
    disabled={!restaurantForm.state}
    onChange={(e) => {
      setCitySearch(e.target.value);

      setRestaurantForm({
        ...restaurantForm,
        city: "",
      });
    }}
    className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold disabled:cursor-not-allowed disabled:bg-gray-100"
  />

  {citySearch && restaurantForm.state && (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
      {(() => {
        const selectedState = indiaStates.find(
          (state) =>
            state.name === restaurantForm.state
        );

        if (!selectedState) return null;

        return City.getCitiesOfState(
          "IN",
          selectedState.isoCode
        )
          .filter((city) =>
            city.name
              .toLowerCase()
              .includes(citySearch.toLowerCase())
          )
          .slice(0, 10)
          .map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => {
                setRestaurantForm({
                  ...restaurantForm,
                  city: city.name,
                });

                setCitySearch("");
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F5E8D4]"
            >
              {city.name}
            </button>
          ));
      })()}
    </div>
  )}
</div>

                </div>

                {/* ROW 4 */}
                <div className="mt-5 grid grid-cols-2 gap-5">

                  {/* PINCODE */}
                  <div>

                    <label className="text-sm font-medium">
                      Pincode
                    </label>

                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={restaurantForm.pincode}
                      onChange={(e) =>
                        setRestaurantForm({
                          ...restaurantForm,
                          pincode: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
                    />

                  </div>

                  {/* STATUS */}
                  <div>

                    <label className="text-sm font-medium">
                      Status
                    </label>

                    <select
                      value={restaurantForm.status}
                      onChange={(e) =>
                        setRestaurantForm({
                          ...restaurantForm,
                          status: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
                    >

                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                    </select>

                  </div>

{/* BRANCH MANAGER */}
<div className="relative">
  <label className="text-sm font-medium">
    Branch Manager
  </label>

  <input
    type="text"
    placeholder="Search or select Branch Manager"
    value={
      managerList.find(
        (manager) =>
          String(manager.id) ===
          String(restaurantForm.managerId)
      )?.name || managerSearch
    }
    onFocus={() => setIsManagerDropdownOpen(true)}
    onChange={(e) => {
      setManagerSearch(e.target.value);

      setRestaurantForm({
        ...restaurantForm,
        managerId: "",
      });

      setIsManagerDropdownOpen(true);
    }}
    className="mt-2 h-12 w-full rounded-lg border bg-background px-4 pr-10 outline-none focus:ring-2 focus:ring-brand-gold"
  />

  {/* Dropdown Arrow */}
  <button
    type="button"
    onClick={() =>
      setIsManagerDropdownOpen(
        !isManagerDropdownOpen
      )
    }
    className="absolute right-3 top-[42px] text-gray-500"
  >
    ▼
  </button>

  {/* MANAGER DROPDOWN */}
  {isManagerDropdownOpen && (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">

      {managerList
        .filter(
          (manager) =>
            String(manager.ownerId) ===
              String(currentOwnerId) &&
            manager.name
              .toLowerCase()
              .includes(
                managerSearch.toLowerCase()
              )
        )
        .slice(0, 3)
        .map((manager) => (
          <button
            key={manager.id}
            type="button"
            onClick={() => {
              setRestaurantForm({
                ...restaurantForm,
                managerId: manager.id,
              });

              setManagerSearch("");
              setIsManagerDropdownOpen(false);
            }}
            className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F5E8D4]"
          >
            {manager.name}
          </button>
        ))}

      {managerList.filter(
        (manager) =>
          String(manager.ownerId) ===
            String(currentOwnerId) &&
          manager.name
            .toLowerCase()
            .includes(managerSearch.toLowerCase())
      ).length === 0 && (
        <p className="px-4 py-3 text-sm text-gray-500">
          No manager found
        </p>
      )}

    </div>
  )}
</div>

                </div>

                {/* BUTTONS */}
                <div className="mt-6 flex items-center justify-end gap-3 border-t pt-5">

                  {/* CANCEL */}
                  <button
                    type="button"
                    onClick={() =>
                      setIsModalOpen(false)
                    }
                    className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    Cancel
                  </button>

                  {/* CREATE */}
                  <button
                    type="button"
                    onClick={handleCreateRestaurant}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Create Restaurant
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
