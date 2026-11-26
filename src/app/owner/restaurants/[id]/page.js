"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import ManagerFormModal from "@/components/owner/ManagerFormModal";
import {
  Pencil,
  Trash2,
  UserRound,
  UtensilsCrossed,
  Table2,
  QrCode,
  ClipboardList,
} from "lucide-react";

export default function RestaurantDetails() {
  const params = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [manager, setManager] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
 

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
  });

  // --------------------------------
  // GET RESTAURANT
  // --------------------------------

useEffect(() => {
  setMounted(true);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(
        "/api/owners/restaurants",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setRestaurant(null);
        return;
      }

    const foundRestaurant = data.restaurants.find(
  (item) =>
    String(item.id || item._id) === String(params.id)
);

      setRestaurant(foundRestaurant || null);

      // Manager data abhi localStorage se hi load hoga
// Fetch assigned manager from MongoDB
if (foundRestaurant?.managerId) {
  const managerResponse = await fetch("/api/owners/managers", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const managerData = await managerResponse.json();

  if (managerResponse.ok && managerData.success) {
    const foundManager = managerData.managers.find(
      (item) =>
        String(item.id) === String(foundRestaurant.managerId)
    );

    setManager(foundManager || null);
  } else {
    setManager(null);
  }
} else {
  setManager(null);
}
    } catch (error) {
      console.error("Fetch restaurant error:", error);
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  fetchRestaurant();
}, [params.id]);

  // --------------------------------
  // OPEN EDIT MODAL
  // --------------------------------

  const handleEditRestaurant = () => {
    if (!restaurant) {
      return;
    }

    setRestaurantForm({
      name: restaurant.name || "",
      location: restaurant.location || "",
      phone: restaurant.phone || "",
      email: restaurant.email || "",
      address: restaurant.address || "",
      state: restaurant.state || "",
      city: restaurant.city || "",
      pincode: restaurant.pincode || "",
      status: restaurant.status || "Active",
    });

    setIsEditModalOpen(true);
  };

  // --------------------------------
  // SAVE CHANGES
  // --------------------------------

const handleSaveChanges = async () => {
  if (!restaurantForm.name.trim()) {
    alert("Please enter restaurant name.");
    return;
  }

  if (!restaurantForm.location.trim()) {
    alert("Please enter restaurant location.");
    return;
  }

  try {
    const response = await fetch("/api/owners/restaurants", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        restaurantId: params.id,
        restaurant: {
          ...restaurantForm,
          gstNumber: restaurant.gstNumber || "",
          managerId: restaurant.managerId || "",
          image: restaurant.image || "",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || "Unable to update restaurant.");
      return;
    }

    setRestaurant(data.restaurant);
    setIsEditModalOpen(false);

    alert("Restaurant updated successfully.");
  } catch (error) {
    console.error("Update restaurant error:", error);
    alert("Something went wrong while updating restaurant.");
  }
};

  const handleDeleteRestaurant = () => {
  const loggedInOwnerId = localStorage.getItem("loggedInOwnerId");

  if (!loggedInOwnerId) {
    window.location.href = "/login";
    return;
  }

  const savedRestaurants = localStorage.getItem("restaurants");

  if (!savedRestaurants) {
    return;
  }

  const restaurants = JSON.parse(savedRestaurants);

  const updatedRestaurants = restaurants.filter(
    (item) =>
      !(
        String(item.id) === String(params.id) &&
        String(item.ownerId) === String(loggedInOwnerId)
      )
  );

  localStorage.setItem(
    "restaurants",
    JSON.stringify(updatedRestaurants)
  );

  window.location.href = "/owner/restaurants";
};


if (!mounted) {
  return null;
}
  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-background">

        <OwnerSidebar />

       <main className="flex min-h-screen w-full min-w-0 items-center justify-center px-4 pt-20 lg:ml-64 lg:w-auto">

          <p className="text-muted-foreground">
            Loading restaurant...
          </p>

        </main>

      </div>
    );
  }

  // --------------------------------
  // RESTAURANT NOT FOUND
  // --------------------------------

if (!restaurant) {
  return (
    <div className="min-h-screen bg-[#F7F4EE]">
      <OwnerSidebar />

      <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 lg:ml-64">
        <h1 className="text-2xl font-bold text-[#171411]">
          Restaurant Not Found
        </h1>

        <p className="mt-2 text-sm text-[#716B64]">
          This restaurant could not be found or you do not have access to it.
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/owner/restaurants";
          }}
          className="mt-6 rounded-lg bg-[#171411] px-5 py-3 text-white"
        >
          Back to Restaurants
        </button>
      </main>
    </div>
  );
}

 return (
  <div className="min-h-screen bg-[#F7F4EE]">

    <OwnerSidebar />

  <main className="min-h-screen min-w-0 w-full max-w-full overflow-x-hidden p-4 pt-20 sm:p-6 lg:ml-64 lg:w-auto lg:p-8">

      {/* ================= BREADCRUMB ================= */}
      <button
        type="button"
        onClick={() => {
          window.location.href = "/owner/restaurants";
        }}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#716B64] transition hover:text-[#171411]"
      >
        <span className="text-lg">←</span>
        Restaurants
      </button>


      {/* ================= HERO CARD ================= */}
      <div
className="relative min-h-[420px] w-full min-w-0 overflow-hidden rounded-2xl bg-[#171411] bg-cover bg-[center_35%] shadow-[0_20px_60px_rgba(23,20,17,0.12)] sm:rounded-3xl lg:min-h-[380px]"
  style={{
    backgroundImage: `url(${restaurant.image})`,
  }}
>

    {/* DARK OVERLAY */}
<div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/0" />

    <div className="relative z-10 flex min-h-[420px] flex-col justify-start gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:min-h-[380px] lg:justify-between lg:px-8 lg:py-16">

        <div className="flex min-w-0 flex-col items-stretch gap-6 sm:gap-7 lg:flex-row lg:items-center lg:justify-between">

            {/* RESTAURANT INFO */}
      <div className="flex min-w-0 items-start">

            {/* RESTAURANT IMAGE */}
{/* <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl">
  <img
    src={restaurant.image}
    alt={restaurant.name}
    className="h-full w-full object-cover"
  />
</div> */}


              <div>

                <div className="mb-2 flex flex-wrap items-center gap-3">

               <span className="inline-flex w-fit items-center rounded-full border border-[#D5A960]/30 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E6C87A]">
  Restaurant
</span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
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


              <h1 className="break-words text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
                  {restaurant.name}
                </h1>


               <p className="mt-2 text-sm font-medium text-white/80">
                  {restaurant.location ||
                    [restaurant.city, restaurant.state]
                      .filter(Boolean)
                      .join(", ") ||
                    "Location not available"}
                </p>


<p className="mt-3 break-all text-xs font-medium text-white/80">
  Restaurant ID: {restaurant.restaurantCode || "Not Assigned"}
</p>

<p className="mt-2 break-all text-xs font-medium text-white/80">
  Owner ID: {restaurant.ownerCode || "Not Assigned"}
</p>

              </div>

            </div>


            {/* EDIT BUTTON */}
            <button
              type="button"
              onClick={handleEditRestaurant}
          className="inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-[#D5A960] px-4 py-3 text-sm font-semibold text-[#171411] shadow-lg shadow-black/20 transition hover:bg-[#E1B875] sm:w-fit lg:w-auto"
            >
              <Pencil size={16} className="mr-2" />
              Edit Restaurant
            </button>

          </div>

        </div>


        {/* HERO BOTTOM INFO */}
     <div className="relative z-10 mt-8 grid grid-cols-1 border-t border-white/15 bg-black/55 sm:grid-cols-2 lg:mt-0 lg:grid-cols-3">

          <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8">

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#817A72]">
              Phone
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              {restaurant.phone || "Not available"}
            </p>

          </div>


          <div className="border-t border-white/10 px-4 py-4 sm:px-6 sm:py-5 lg:border-l lg:border-t-0 lg:px-8">

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#817A72]">
              Email
            </p>

            <p className="mt-1 break-all text-sm font-medium text-white">
              {restaurant.email || "Not available"}
            </p>

          </div>


          <div className="border-t border-white/10 px-8 py-5 md:border-l md:border-t-0">

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#817A72]">
              GST Number
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              {restaurant.gstNumber || "Not available"}
            </p>

          </div>

        </div>

      </div>


      {/* ================= MAIN CONTENT ================= */}
    <div className="mt-5 grid w-full min-w-0 grid-cols-1 items-start gap-5 sm:mt-7 sm:gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">

        {/* ================= RESTAURANT INFORMATION ================= */}
        <section className="rounded-2xl border border-[#E5DED4] bg-white shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

          <div className="border-b border-[#EEE8DF] px-4 py-5 sm:px-7 sm:py-6">

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B88945]">
              Information
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#171411]">
              Restaurant Information
            </h2>

            <p className="mt-1 text-sm text-[#716B64]">
              Complete information about this restaurant.
            </p>

          </div>


          <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 px-4 py-5 sm:gap-x-10 sm:gap-y-6 sm:px-7 sm:py-7 md:grid-cols-2">

            {/* NAME */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                Restaurant Name
              </p>

              <p className="mt-2 text-sm font-semibold text-[#171411]">
                {restaurant.name || "Not available"}
              </p>
            </div>


            {/* LOCATION */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                Location
              </p>

              <p className="mt-2 text-sm font-semibold text-[#171411]">
                {restaurant.location || "Not available"}
              </p>
            </div>


            {/* PHONE */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                Phone
              </p>

              <p className="mt-2 text-sm font-semibold text-[#171411]">
                {restaurant.phone || "Not available"}
              </p>
            </div>


            {/* EMAIL */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                Email
              </p>

<p className="mt-2 break-all text-sm font-semibold text-[#171411]">
  {restaurant.email || "Not available"}
</p>
            </div>


            {/* GST */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                GST Number
              </p>

              <p className="mt-2 text-sm font-semibold text-[#171411]">
                {restaurant.gstNumber || "Not available"}
              </p>
            </div>


            {/* PINCODE */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                Pincode
              </p>

              <p className="mt-2 text-sm font-semibold text-[#171411]">
                {restaurant.pincode || "Not available"}
              </p>
            </div>


            {/* ADDRESS */}
            <div className="md:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                Full Address
              </p>

              <div className="mt-2 rounded-xl bg-[#FCFAF7] px-4 py-3">

                <p className="text-sm font-medium leading-6 text-[#4F4942]">
                  {restaurant.address || "Address not available"}
                </p>

              </div>

            </div>


            {/* CITY */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                City
              </p>

              <p className="mt-2 text-sm font-semibold text-[#171411]">
                {restaurant.city || "Not available"}
              </p>
            </div>


            {/* STATE */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
                State
              </p>

              <p className="mt-2 text-sm font-semibold text-[#171411]">
                {restaurant.state || "Not available"}
              </p>
            </div>

          </div>

        </section>

{/* ================= BRANCH & MANAGEMENT INFORMATION ================= */}

<section className="mt-6 rounded-2xl border border-[#E5DED4] bg-white shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

  <div className="border-b border-[#EEE8DF] px-4 py-5 sm:px-7 sm:py-6">

    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B88945]">
      Branch & Management
    </p>

    <h2 className="mt-1 text-xl font-bold text-[#171411]">
      Restaurant Assignment
    </h2>

    <p className="mt-1 text-sm text-[#716B64]">
      Branch and management information for this restaurant.
    </p>

  </div>


  <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 px-4 py-5 sm:gap-x-10 sm:gap-y-6 sm:px-7 sm:py-7 md:grid-cols-2">

    {/* BRANCH TYPE */}
    <div>

      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
        Branch Type
      </p>

      <p className="mt-2 text-sm font-semibold text-[#171411]">
        {restaurant.branchType === "main"
          ? "Main Branch"
          : restaurant.branchType === "sub"
          ? "Sub Branch"
          : "Not available"}
      </p>

    </div>


    {/* BRANCH MANAGER */}
    <div>

      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
        Branch Manager
      </p>

      <p className="mt-2 text-sm font-semibold text-[#171411]">
        {manager?.name || "Not assigned"}
      </p>

    </div>


{/* RESTAURANT ID */}
<div className="md:col-span-2 min-w-0">
  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
    Restaurant ID
  </p>

  <p className="mt-2 break-all text-sm font-semibold text-[#171411]">
    {restaurant.restaurantCode || "Not available"}
  </p>
</div>


{/* OWNER ID */}
<div className="md:col-span-2 min-w-0">
  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
    Owner ID
  </p>

  <p className="mt-2 break-all text-sm font-semibold text-[#171411]">
   {restaurant.ownerCode || "Not available"}
  </p>
</div>

{/* MANAGER ID */}
<div className="md:col-span-2 min-w-0">
  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
    Manager ID
  </p>

  <p className="mt-2 break-all text-sm font-semibold text-[#171411]">
  {manager?.managerCode || "Not assigned"}
  </p>
</div>



    {/* PARENT RESTAURANT */}

    {/* <div className="md:col-span-2">

      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
        Parent Restaurant ID
      </p>

      <p className="mt-2 text-sm font-semibold text-[#171411]">
        {restaurant.parentRestaurantId || "None — Main Branch"}
      </p>

    </div> */}

  </div>

</section>


        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="w-full min-w-0 space-y-5 sm:space-y-6">


          {/* STATUS */}
          <div className="rounded-2xl border border-[#E5DED4] bg-white p-4 shadow-[0_8px_30px_rgba(23,20,17,0.04)] sm:p-6">

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9A9289]">
              Current Status
            </p>

            <div className="mt-5 flex items-center gap-4">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  restaurant.status === "Active"
                    ? "bg-[#E8F2EB]"
                    : "bg-[#FBEAEA]"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full ${
                    restaurant.status === "Active"
                      ? "bg-[#3F7D5A]"
                      : "bg-[#C85C5C]"
                  }`}
                />
              </div>


              <div>

                <p className="font-bold text-[#171411]">
                  {restaurant.status}
                </p>

                <p className="mt-1 text-xs text-[#9A9289]">
                  Restaurant availability
                </p>

              </div>

            </div>

          </div>


          {/* MANAGEMENT */}
          <div className="rounded-2xl border border-[#E5DED4] bg-white p-6 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B88945]">
              Management
            </p>

            <h3 className="mt-1 text-lg font-bold text-[#171411]">
              Restaurant Control Center
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#716B64]">
              Manage everything related to this restaurant from one place.
            </p>


            <div className="mt-5 space-y-2">


              {/* MANAGERS */}
            <button
  type="button"
  onClick={() => setIsManagerModalOpen(true)}
  className="group flex w-full items-center justify-between rounded-xl border border-[#EEE8DF] p-3 text-left transition hover:border-[#D5A960] hover:bg-[#FCFAF7]"
>

                <span className="flex items-center gap-3">

                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5E8D4] text-[#B88945]">
  <UserRound size={18} strokeWidth={1.8} />
</span>

                  <span>
                    <span className="block text-sm font-semibold text-[#171411]">
                      Managers
                    </span>

                    <span className="block text-xs text-[#9A9289]">
                      Manage restaurant staff
                    </span>
                  </span>

                </span>

                <span className="text-[#B88945] transition group-hover:translate-x-1">
                  →
                </span>

              </button>


              {/* MENU */}
         
<button
  type="button"
  onClick={() => {
    window.location.href = `/owner/menu?restaurantId=${restaurant.id}`;
  }}
  className="group flex w-full items-center justify-between rounded-xl border border-[#EEE8DF] p-3 text-left transition hover:border-[#D5A960] hover:bg-[#FCFAF7]"
>
                <span className="flex items-center gap-3">

                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5E8D4] text-[#B88945]">
  <UtensilsCrossed size={18} strokeWidth={1.8} />
</span>

                  <span>
                    <span className="block text-sm font-semibold text-[#171411]">
                      Menu
                    </span>

                    <span className="block text-xs text-[#9A9289]">
                      Manage food and categories
                    </span>
                  </span>

                </span>

                <span className="text-[#B88945] transition group-hover:translate-x-1">
                  →
                </span>

              </button>


              {/* TABLES */}
              <button
                type="button"
                className="group flex w-full items-center justify-between rounded-xl border border-[#EEE8DF] p-3 text-left transition hover:border-[#D5A960] hover:bg-[#FCFAF7]"
              >

                <span className="flex items-center gap-3">

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5E8D4] text-[#B88945]">
  <Table2 size={18} strokeWidth={1.8} />
</span>

                  <span>
                    <span className="block text-sm font-semibold text-[#171411]">
                      Tables
                    </span>

                    <span className="block text-xs text-[#9A9289]">
                      Manage restaurant tables
                    </span>
                  </span>

                </span>

                <span className="text-[#B88945] transition group-hover:translate-x-1">
                  →
                </span>

              </button>


              {/* QR */}
              <button
                type="button"
                className="group flex w-full items-center justify-between rounded-xl border border-[#EEE8DF] p-3 text-left transition hover:border-[#D5A960] hover:bg-[#FCFAF7]"
              >

                <span className="flex items-center gap-3">

                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5E8D4] text-[#B88945]">
  <QrCode size={18} strokeWidth={1.8} />
</span>

                  <span>
                    <span className="block text-sm font-semibold text-[#171411]">
                      QR Codes
                    </span>

                    <span className="block text-xs text-[#9A9289]">
                      Generate table QR codes
                    </span>
                  </span>

                </span>

                <span className="text-[#B88945] transition group-hover:translate-x-1">
                  →
                </span>

              </button>


              {/* ORDERS */}
              <button
                type="button"
                className="group flex w-full items-center justify-between rounded-xl border border-[#EEE8DF] p-3 text-left transition hover:border-[#D5A960] hover:bg-[#FCFAF7]"
              >

                <span className="flex items-center gap-3">

                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5E8D4] text-[#B88945]">
  <ClipboardList size={18} strokeWidth={1.8} />
</span>

                  <span>
                    <span className="block text-sm font-semibold text-[#171411]">
                      Orders
                    </span>

                    <span className="block text-xs text-[#9A9289]">
                      View restaurant orders
                    </span>
                  </span>

                </span>

                <span className="text-[#B88945] transition group-hover:translate-x-1">
                  →
                </span>

              </button>

            </div>

          </div>


          {/* DELETE */}
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#F0D8D8] bg-white px-4 py-3 text-sm font-semibold text-[#C85C5C] transition hover:bg-[#FFF7F7]"
          >
            <Trash2 size={16} />
            Delete Restaurant
          </button>

        </div>

      </div>

    </main>
      {/* ================================= */}
      {/* EDIT MODAL */}
      {/* ================================= */}

      {isEditModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-card shadow-xl">

            {/* MODAL HEADER */}

       <div className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-7 sm:py-5">
              <div>

             <h2 className="text-xl font-semibold sm:text-2xl">
                  Edit Restaurant
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update restaurant information
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsEditModalOpen(false)
                }
                className="text-xl text-muted-foreground hover:text-foreground"
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="max-h-[calc(90vh-100px)] overflow-y-auto">

              <div className="px-4 py-5 sm:px-7 sm:py-6">

                {/* NAME + LOCATION */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                  <div>

                    <label className="text-sm font-medium">
                      Restaurant Name
                    </label>

                    <input
                      type="text"
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

                  <div>

                    <label className="text-sm font-medium">
                      Location
                    </label>

                    <input
                      type="text"
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

                {/* PHONE + EMAIL */}

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                  <div>

                    <label className="text-sm font-medium">
                      Phone
                    </label>

                    <input
                      type="tel"
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

                  <div>

                    <label className="text-sm font-medium">
                      Email
                    </label>

                    <input
                      type="email"
                      value={restaurantForm.email}
                      onChange={(e) =>
                        setRestaurantForm({
                          ...restaurantForm,
                          email: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
                    />

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="mt-5">

                  <label className="text-sm font-medium">
                    Address
                  </label>

                  <textarea
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

                {/* STATE + CITY */}

             <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                  <div>

                    <label className="text-sm font-medium">
                      State
                    </label>

                    <input
                      type="text"
                      value={restaurantForm.state}
                      onChange={(e) =>
                        setRestaurantForm({
                          ...restaurantForm,
                          state: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
                    />

                  </div>

                  <div>

                    <label className="text-sm font-medium">
                      City
                    </label>

                    <input
                      type="text"
                      value={restaurantForm.city}
                      onChange={(e) =>
                        setRestaurantForm({
                          ...restaurantForm,
                          city: e.target.value,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
                    />

                  </div>

                </div>

                {/* PINCODE + STATUS */}

               <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                  <div>

                    <label className="text-sm font-medium">
                      Pincode
                    </label>

                    <input
                      type="text"
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

                </div>

                {/* BUTTONS */}

               <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() =>
                      setIsEditModalOpen(false)
                    }
                   className="w-full rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-secondary sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveChanges}
                  className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 sm:w-auto"
                  >
                    Save Changes
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {isDeleteModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-6">

      <h2 className="text-xl font-semibold text-gray-900">
        Delete Restaurant?
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-900">
          {restaurant?.name}
        </span>
        ?
        <br />
        This action cannot be undone.
      </p>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        {/* CANCEL */}
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(false)}
        className="w-full rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
        >
          Cancel
        </button>



        {/* DELETE */}
        <button
          type="button"
          onClick={handleDeleteRestaurant}
         className="w-full rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 sm:w-auto"
        >
          Delete Restaurant
        </button>

      </div>

<ManagerFormModal
  isOpen={isManagerModalOpen}
  onClose={() => setIsManagerModalOpen(false)}
  restaurant={restaurant}
/>


    </div>
  </div>
)}

    </div>
  );
}