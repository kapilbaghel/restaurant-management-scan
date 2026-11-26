"use client";

import { useEffect, useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import { City, State } from "country-state-city";

import OwnerSidebar from "@/components/owner/OwnerSidebar";

// import { restaurants as initialRestaurants } from "@/data/restaurants";



export default function OwnerRestaurants() {

 const [restaurantList, setRestaurantList] = useState([]);



  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingRestaurantId, setEditingRestaurantId] = useState(null);

const [deletingRestaurantId, setDeletingRestaurantId] = useState(null);



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

  const trimmedEmail = email.trim();



  if (!trimmedEmail) {

    return "";

  }



  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;



  if (!emailRegex.test(trimmedEmail)) {

    return "Invalid email ID — please enter a valid email with a domain.";

  }



  return "";

};





  // --------------------------------

  // GET LOGGED-IN OWNER

  // --------------------------------





useEffect(() => {

  const fetchOwnerRestaurants = async () => {

const ownerResponse = await fetch("/api/owners/me", {

  method: "GET",

  credentials: "include",

  cache: "no-store",

});



const ownerData = await ownerResponse.json();



if (!ownerResponse.ok || !ownerData.success || !ownerData.owner) {

  window.location.href = "/login";

  return;

}



setCurrentOwnerId(ownerData.owner.id || ownerData.owner._id);



    // MANAGERS FROM OLD LOCALSTORAGE

// FETCH MANAGERS FROM MONGODB

try {

  const managerResponse = await fetch("/api/owners/managers", {

    method: "GET",

    credentials: "include",

    cache: "no-store",

  });



  const managerData = await managerResponse.json();



  if (!managerResponse.ok || !managerData.success) {

    throw new Error(managerData.message || "Unable to fetch managers.");

  }



  setManagerList(managerData.managers || []);

} catch (error) {

  console.error("Manager fetch error:", error);

}



    try {

      // FETCH RESTAURANTS FROM MONGODB

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



      // FILTER LOGGED-IN OWNER'S RESTAURANTS

setRestaurantList(restaurantData.restaurants || []);



    } catch (error) {

      console.error("Owner restaurants error:", error);

    }

  };



  fetchOwnerRestaurants();

}, []);





  // --------------------------------

  // OWNER RESTAURANTS

  // --------------------------------



 const ownerRestaurants = restaurantList;







const handleEditRestaurant = (restaurant) => {

  setEditingRestaurantId(restaurant.id);



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

    managerId: restaurant.managerId || "",

  });



  setEmailError("");

  setManagerSearch("");

  setStateSearch("");

  setCitySearch("");



  setIsModalOpen(true);

};







const handleDeleteRestaurant = () => {

  if (deletingRestaurantId === null) return;



  const updatedRestaurants = restaurantList.filter(

    (restaurant) =>

      String(restaurant.id) !== String(deletingRestaurantId)

  );



  // Update React state

  setRestaurantList(updatedRestaurants);



  // Update localStorage

  localStorage.setItem(

    "restaurants",

    JSON.stringify(updatedRestaurants)

  );



  // Close confirmation modal

  setDeletingRestaurantId(null);

};



const handleCancelDelete = () => {

  setDeletingRestaurantId(null);

};





  // --------------------------------

  // CREATE RESTAURANT

  // --------------------------------



const handleCreateRestaurant = async () => {



  // EDIT EXISTING RESTAURANT

  if (editingRestaurantId !== null) {

    if (!restaurantForm.name.trim()) {

  alert("Please enter restaurant name.");

  return;

}



if (!restaurantForm.location.trim()) {

  alert("Please enter restaurant location.");

  return;

}



const emailValidationError = validateEmail(restaurantForm.email);



if (emailValidationError) {

  setEmailError(emailValidationError);

  return;

}

    try {

     const response = await fetch("/api/owners/restaurants", {

        method: "PUT",

        credentials: "include",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          restaurantId: editingRestaurantId,

restaurant: {

  name: restaurantForm.name,

  location: restaurantForm.location,

  phone: restaurantForm.phone,

  email: restaurantForm.email,

  address: restaurantForm.address,

  state: restaurantForm.state,

  city: restaurantForm.city,

  pincode: restaurantForm.pincode,

  status: restaurantForm.status,

  managerId: restaurantForm.managerId,

},

        }),

      });



      const data = await response.json();



      if (!response.ok || !data.success) {

        alert(data.message || "Unable to update restaurant.");

        return;

      }



      const updatedRestaurants = restaurantList.map((restaurant) =>

        String(restaurant.id) === String(editingRestaurantId)

          ? {

              ...restaurant,

              name: restaurantForm.name,

               location: restaurantForm.location,

              phone: restaurantForm.phone,

              email: restaurantForm.email,

              address: restaurantForm.address,

              state: restaurantForm.state,

              city: restaurantForm.city,

              pincode: restaurantForm.pincode,

              status: restaurantForm.status,

              managerId: restaurantForm.managerId,

            }

          : restaurant

      );



      setRestaurantList(updatedRestaurants);

      setIsModalOpen(false);

      setEditingRestaurantId(null);



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

      setManagerSearch("");

      setStateSearch("");

      setCitySearch("");



    } catch (error) {

      console.error("Update restaurant error:", error);

      alert("Unable to connect to server. Please try again.");

    }



    return;

  }



  // CHECK OWNER SESSION

  if (!currentOwnerId) {

    alert("Owner session not found. Please login again.");

    window.location.href = "/login";

    return;

  }



  // RESTAURANT NAME VALIDATION

  if (!restaurantForm.name.trim()) {

    alert("Please enter restaurant name.");

    return;

  }



  // LOCATION VALIDATION

  if (!restaurantForm.location.trim()) {

    alert("Please enter restaurant location.");

    return;

  }



  // EMAIL VALIDATION

  const emailValidationError = validateEmail(restaurantForm.email);



  if (emailValidationError) {

    setEmailError(emailValidationError);

    return;

  }



  // FIND EXISTING MAIN BRANCH

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



const restaurantImage = (() => {

  const restaurantName = restaurantForm.name

    .trim()

    .toLowerCase();



  if (restaurantName === "spice route") {

    return "/restaurants/spice-route/hero.jpg";

  }



  if (restaurantName === "traditional taste") {

    return "/restaurants/traditional-taste/hero.jpg";

  }



  return mainBranch?.image || "";

})();



  // SAVE RESTAURANT IN MONGODB

  try {

    const response = await fetch("/api/owners/restaurants", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

body: JSON.stringify({

  ownerId: currentOwnerId,

  name: restaurantForm.name,

  location: restaurantForm.location,

  managerId: restaurantForm.managerId,

  phone: restaurantForm.phone,

  email: restaurantForm.email,

  address: restaurantForm.address,

  city: restaurantForm.city,

  state: restaurantForm.state,

  pincode: restaurantForm.pincode,

  status: restaurantForm.status,

  image: restaurantImage,

}),

    });



    const data = await response.json();



    if (!response.ok || !data.success) {

      alert(data.message || "Unable to create restaurant.");

      return;

    }



    // ADD MONGODB RESTAURANT TO PAGE

    const newRestaurant = {

      ...data.restaurant,

      location: restaurantForm.location,

      managerId: restaurantForm.managerId,

    };



    setRestaurantList((previousList) => [

      ...previousList,

      newRestaurant,

    ]);



    // CLOSE MODAL

    setIsModalOpen(false);



    // RESET FORM

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

    setManagerSearch("");

    setStateSearch("");

    setCitySearch("");



    alert("Restaurant created successfully!");



  } catch (error) {

    console.error("Create restaurant error:", error);

    alert("Unable to connect to server. Please try again.");

  }

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



<main className="min-h-screen min-w-0 w-full max-w-full overflow-x-hidden bg-[#F7F4EE] p-4 pt-20 sm:p-6 lg:ml-64 lg:w-auto lg:p-8">





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



<div className="mb-8 grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">



  {/* TOTAL RESTAURANTS */}

  <div className="group relative overflow-hidden rounded-2xl border border-[#E8E0D4] bg-[#FFFDFA] p-6 shadow-[0_5px_25px_rgba(37,39,33,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(37,39,33,0.08)]">



    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#C5A16A]/10" />



    <div className="relative flex items-start justify-between">

      <div>

        <p className="text-sm font-medium text-[#827B70]">

          Total Restaurants

        </p>



        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#252721]">

          {ownerRestaurants.length}

        </h2>



        <p className="mt-3 text-xs font-medium text-[#A17B43]">

          Restaurants assigned to you

        </p>

      </div>



      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5EBDD] text-xl font-bold text-[#A17B43]">

        R

      </div>

    </div>



    <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[#F0EAE0]">

      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#C5A16A] to-[#E6C87A]" />

    </div>

  </div>





  {/* ACTIVE RESTAURANTS */}

  <div className="group relative overflow-hidden rounded-2xl border border-[#E8E0D4] bg-[#FFFDFA] p-6 shadow-[0_5px_25px_rgba(37,39,33,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(37,39,33,0.08)]">



    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#39734C]/10" />



    <div className="relative flex items-start justify-between">

      <div>

        <p className="text-sm font-medium text-[#827B70]">

          Active Restaurants

        </p>



        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#39734C]">

          {

            ownerRestaurants.filter(

              (restaurant) => restaurant.status === "Active"

            ).length

          }

        </h2>



        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[#39734C]">

          <span className="h-2 w-2 rounded-full bg-[#39734C]" />

          Currently operational

        </p>

      </div>



      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F1E9]">

        <span className="h-3 w-3 rounded-full bg-[#39734C]" />

      </div>

    </div>



    <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[#E8F1E9]">

      <div className="h-full w-full rounded-full bg-[#39734C]" />

    </div>

  </div>





  {/* INACTIVE RESTAURANTS */}

  <div className="group relative overflow-hidden rounded-2xl border border-[#E8E0D4] bg-[#FFFDFA] p-6 shadow-[0_5px_25px_rgba(37,39,33,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(37,39,33,0.08)]">



    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#B94D4D]/10" />



    <div className="relative flex items-start justify-between">

      <div>

        <p className="text-sm font-medium text-[#827B70]">

          Inactive Restaurants

        </p>



        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#B94D4D]">

          {

            ownerRestaurants.filter(

              (restaurant) => restaurant.status === "Inactive"

            ).length

          }

        </h2>



        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[#B94D4D]">

          <span className="h-2 w-2 rounded-full bg-[#B94D4D]" />

          Currently unavailable

        </p>

      </div>



      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBEAEA]">

        <span className="h-3 w-3 rounded-full bg-[#B94D4D]" />

      </div>

    </div>



    <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[#FBEAEA]">

      <div className="h-full w-full rounded-full bg-[#B94D4D]" />

    </div>

  </div>



</div>







  {/* ================= RESTAURANT LIST ================= */}

  <section>







{/* SECTION HEADER */}

<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">



  <div>

    <div className="flex items-center gap-2">

      <span className="h-6 w-1 rounded-full bg-[#C5A16A]" />



      <h2 className="text-xl font-bold tracking-tight text-[#252721]">

        Restaurant List

      </h2>

    </div>



    <p className="mt-2 text-sm text-[#827B70]">

      View and manage all restaurants assigned to your account.

    </p>

  </div>



  <div className="flex items-center gap-3">


<span className="inline-flex items-center rounded-full border border-[#DCC9A9] bg-[#F5EBDD] px-4 py-2 text-sm font-semibold text-[#8A6838]">
  {ownerRestaurants.length}{" "}
  {ownerRestaurants.length === 1
    ? "Restaurant"
    : "Restaurants"}
</span>



    {/* <button

      type="button"

      onClick={() => setIsModalOpen(true)}

      className="rounded-xl bg-[#102D26] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#194638]"

    >

      + Add Restaurant

    </button> */}



  </div>



</div>











{/* ================= EMPTY STATE ================= */}

{ownerRestaurants.length === 0 ? (

  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8CFC4] bg-[#FFFDFA] px-6 py-16 text-center">



    {/* RESTAURANT ICON */}

    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#E8D9BD] bg-[#F5EFE3] text-[#102D26] shadow-sm">

      <span className="text-4xl">🍽️</span>

    </div>



    {/* HEADING */}

    <h3 className="mt-6 text-xl font-bold tracking-tight text-[#252721]">

      No Restaurants Found

    </h3>



    {/* DESCRIPTION */}

    <p className="mt-2 max-w-md text-sm leading-6 text-[#827B70]">

      You do not have any restaurants assigned to your account yet.

      Create your first restaurant to get started.

    </p>



    {/* CREATE BUTTON */}

    <button

      type="button"

      onClick={() => setIsModalOpen(true)}

      className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#102D26] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#194638] hover:shadow-lg"

    >

      <span className="text-lg text-[#E6C87A]">+</span>

      Create Your First Restaurant

    </button>



    <p className="mt-4 text-xs text-[#A49B8D]">

      Get started by adding your first restaurant branch.

    </p>



  </div>

) : (

<>





{/* ================= RESTAURANT CARDS ================= */}



<div className="grid w-full min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">



  {ownerRestaurants.map((restaurant) => {

    const manager = managerList.find(

      (item) => String(item.id) === String(restaurant.managerId)

    );



    return (

      <div

        key={restaurant.id}

        className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8E0D4] bg-[#FFFDFA] shadow-[0_5px_25px_rgba(37,39,33,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A16A]/60 hover:shadow-[0_15px_35px_rgba(37,39,33,0.10)]"

      >

        {/* TOP GOLD ACCENT */}

        <div className="h-1 w-full bg-gradient-to-r from-[#C5A16A] via-[#E6C87A] to-[#C5A16A]" />



        <div className="flex flex-1 flex-col p-5 sm:p-6">



          {/* RESTAURANT HEADER */}

          <div className="flex items-start justify-between gap-3">



            <div className="flex min-w-0 items-center gap-3">



              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#102D26] text-xl font-bold uppercase text-[#E6C87A] shadow-sm">

                {restaurant.name?.charAt(0)?.toUpperCase() || "R"}

              </div>



              <div className="min-w-0">

                <h3 className="truncate text-lg font-bold tracking-tight text-[#252721]">

                  {restaurant.name}

                </h3>



                <p className="mt-1 text-xs font-medium text-[#A17B43]">

                  {restaurant.branchType === "main" || !restaurant.branchType

                    ? "Main Branch"

                    : "Sub Branch"}

                </p>



                <p className="mt-1 truncate text-xs text-[#969187]">

                  ID: {restaurant.id}

                </p>

              </div>

            </div>



            {/* STATUS */}

            <span

              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${

                restaurant.status === "Active"

                  ? "bg-[#E8F2E9] text-[#287443]"

                  : "bg-[#FCEBE8] text-[#B54736]"

              }`}

            >

              {restaurant.status || "Active"}

            </span>



          </div>



          {/* DIVIDER */}

          <div className="my-5 border-t border-[#EEE8DE]" />



          {/* LOCATION */}

          <div className="rounded-xl bg-[#F7F4EE] p-4">

            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#A17B43]">

              Location

            </p>

            <p className="text-sm font-medium text-[#252721]">

              {restaurant.location || restaurant.address || "Not added"}

            </p>

          </div>



          {/* CONTACT DETAILS */}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">



            <div className="min-w-0">

              <p className="text-xs font-medium text-[#969187]">

                Phone Number

              </p>

              <p className="mt-1 truncate text-sm font-semibold text-[#252721]">

                {restaurant.phone || "Not added"}

              </p>

            </div>



            <div className="min-w-0">

              <p className="text-xs font-medium text-[#969187]">

                Email Address

              </p>

              <p className="mt-1 truncate text-sm font-semibold text-[#252721]">

                {restaurant.email || "Not added"}

              </p>

            </div>



          </div>



          {/* BRANCH MANAGER */}

          <div className="mt-4">

            <p className="text-xs font-medium text-[#969187]">

              Branch Manager

            </p>

            <p className="mt-1 text-sm font-semibold text-[#252721]">

              {manager?.name || "Not assigned"}

            </p>

          </div>



          {/* ACTION BUTTONS */}

          <div className="mt-auto flex gap-3 border-t border-[#EEE8DE] pt-5">



            <button

              type="button"

              onClick={() => handleEditRestaurant(restaurant)}

              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D9C7A8] bg-[#F8F3EA] px-3 py-2.5 text-sm font-semibold text-[#76572D] transition hover:bg-[#EFE4D1]"

            >

              <Pencil size={16} />

              Edit

            </button>



            <button

              type="button"

              onClick={() => setDeletingRestaurantId(restaurant.id)}

              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E9CECA] bg-[#FFF5F3] px-3 py-2.5 text-sm font-semibold text-[#B54736] transition hover:bg-[#FCE8E5]"

            >

              <Trash2 size={16} />

              Delete

            </button>



          </div>



        </div>

      </div>

    );

  })}



</div>

      </>
)}
      </section>







{/* ADD / EDIT RESTAURANT MODAL */}





{isModalOpen && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

    <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-card shadow-xl">



      {/* MODAL HEADER */}

      <div className="flex shrink-0 items-start justify-between gap-4 border-b px-4 py-4 sm:px-7 sm:py-5">

        <div>

          <h2 className="text-2xl font-semibold">

            {editingRestaurantId !== null

              ? "Edit Restaurant"

              : "Add Restaurant"}

          </h2>



          <p className="mt-1 text-sm text-muted-foreground">

            {editingRestaurantId !== null

              ? "Update restaurant details"

              : "Create a new restaurant"}

          </p>

        </div>



        <button

          type="button"

          onClick={() => {

            setIsModalOpen(false);

            setEmailError("");

            setStateSearch("");

            setCitySearch("");

            setManagerSearch("");

            setIsManagerDropdownOpen(false);

          }}

          className="text-xl text-muted-foreground hover:text-foreground"

        >

          ×

        </button>

      </div>



      {/* MODAL BODY */}

      <div className="min-h-0 flex-1 overflow-y-auto">

        <div className="px-4 py-5 sm:px-7 sm:py-6">



          {/* ROW 1 */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">



            {/* RESTAURANT NAME */}

            <div>

              <label className="text-sm font-medium">

                Restaurant Name

              </label>



              <input

                type="text"

                placeholder="Enter restaurant name"

                value={restaurantForm.name || ""}

                onChange={(e) =>

                  setRestaurantForm((prev) => ({

                    ...prev,

                    name: e.target.value,

                  }))

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

                value={restaurantForm.location || ""}

                onChange={(e) =>

                  setRestaurantForm((prev) => ({

                    ...prev,

                    location: e.target.value,

                  }))

                }

                className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"

              />

            </div>



          </div>



          {/* ROW 2 */}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">



            {/* PHONE */}

            <div>

              <label className="text-sm font-medium">

                Phone

              </label>



              <input

                type="tel"

                placeholder="Enter phone number"

                value={restaurantForm.phone || ""}

                onChange={(e) =>

                  setRestaurantForm((prev) => ({

                    ...prev,

                    phone: e.target.value,

                  }))

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

                value={restaurantForm.email || ""}

                onChange={(e) => {

                  const email = e.target.value;



                  setRestaurantForm((prev) => ({

                    ...prev,

                    email,

                  }));



                  setEmailError(

                    email.trim() ? validateEmail(email) : ""

                  );

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

              value={restaurantForm.address || ""}

              onChange={(e) =>

                setRestaurantForm((prev) => ({

                  ...prev,

                  address: e.target.value,

                }))

              }

              rows={3}

              className="mt-2 w-full resize-none rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

            />

          </div>



          {/* ROW 3 */}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">



            {/* STATE */}

            <div className="relative">

              <label className="text-sm font-medium">

                State

              </label>



              <input

                type="text"

                placeholder="Search state"

                value={stateSearch || restaurantForm.state || ""}

                onChange={(e) => {

                  const value = e.target.value;



                  setStateSearch(value);



                  setRestaurantForm((prev) => ({

                    ...prev,

                    state: "",

                    city: "",

                  }));



                  setCitySearch("");

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

                          setRestaurantForm((prev) => ({

                            ...prev,

                            state: state.name,

                            city: "",

                          }));



                          setStateSearch("");

                          setCitySearch("");

                        }}

                        className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F5E8D4]"

                      >

                        {state.name}

                      </button>

                    ))}



                  {indiaStates.filter((state) =>

                    state.name

                      .toLowerCase()

                      .includes(stateSearch.toLowerCase())

                  ).length === 0 && (

                    <p className="px-4 py-3 text-sm text-gray-500">

                      No state found

                    </p>

                  )}

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

                value={citySearch || restaurantForm.city || ""}

                disabled={!restaurantForm.state}

                onChange={(e) => {

                  setCitySearch(e.target.value);



                  setRestaurantForm((prev) => ({

                    ...prev,

                    city: "",

                  }));

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



                    const filteredCities = City.getCitiesOfState(

                      "IN",

                      selectedState.isoCode

                    ).filter((city) =>

                      city.name

                        .toLowerCase()

                        .includes(citySearch.toLowerCase())

                    );



                    if (filteredCities.length === 0) {

                      return (

                        <p className="px-4 py-3 text-sm text-gray-500">

                          No city found

                        </p>

                      );

                    }



                    return filteredCities.slice(0, 10).map((city) => (

                      <button

                        key={city.name}

                        type="button"

                        onClick={() => {

                          setRestaurantForm((prev) => ({

                            ...prev,

                            city: city.name,

                          }));



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

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">



            {/* PINCODE */}

            <div>

              <label className="text-sm font-medium">

                Pincode

              </label>



              <input

                type="text"

                inputMode="numeric"

                placeholder="Enter pincode"

                value={restaurantForm.pincode || ""}

                onChange={(e) =>

                  setRestaurantForm((prev) => ({

                    ...prev,

                    pincode: e.target.value.replace(/\D/g, "").slice(0, 6),

                  }))

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

                value={restaurantForm.status || "Active"}

                onChange={(e) =>

                  setRestaurantForm((prev) => ({

                    ...prev,

                    status: e.target.value,

                  }))

                }

                className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"

              >

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>

              </select>

            </div>



          </div>



          {/* BRANCH MANAGER */}

          <div className="relative mt-5">

            <label className="text-sm font-medium">

              Branch Manager

            </label>



            <input

              type="text"

              placeholder="Search or select Branch Manager"

              value={

                managerSearch ||

                managerList.find(

                  (manager) =>

                    String(manager.id) ===

                    String(restaurantForm.managerId)

                )?.name ||

                ""

              }

              onFocus={() => setIsManagerDropdownOpen(true)}

              onChange={(e) => {

                setManagerSearch(e.target.value);

                setRestaurantForm((prev) => ({

                  ...prev,

                  managerId: "",

                }));

                setIsManagerDropdownOpen(true);

              }}

              className="mt-2 h-12 w-full rounded-lg border bg-background px-4 pr-10 outline-none focus:ring-2 focus:ring-brand-gold"

            />



            {/* DROPDOWN ARROW */}

            <button

              type="button"

              onClick={() =>

                setIsManagerDropdownOpen((prev) => !prev)

              }

              className="absolute right-3 top-[42px] text-gray-500"

            >

              ▼

            </button>



            {/* MANAGER DROPDOWN */}

            {isManagerDropdownOpen && (

              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">



                {managerList

                  .filter((manager) => {

                    const belongsToOwner =

                      String(manager.ownerId) ===

                      String(currentOwnerId);



                    const isAvailable =

                      !manager.restaurantId ||

                      String(manager.restaurantId) ===

                      String(editingRestaurantId);



                    const matchesSearch =

                      (manager.name || "")

                        .toLowerCase()

                        .includes(managerSearch.toLowerCase());



                    return (

                      belongsToOwner &&

                      isAvailable &&

                      matchesSearch

                    );

                  })

                  .slice(0, 10)

                  .map((manager) => (

                    <button

                      key={manager.id}

                      type="button"

                      onClick={() => {

                        setRestaurantForm((prev) => ({

                          ...prev,

                          managerId: manager.id,

                        }));



                        setManagerSearch("");

                        setIsManagerDropdownOpen(false);

                      }}

                      className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F5E8D4]"

                    >

                      {manager.name}

                    </button>

                  ))}



                {managerList.filter((manager) => {

                  const belongsToOwner =

                    String(manager.ownerId) ===

                    String(currentOwnerId);



                  const isAvailable =

                    !manager.restaurantId ||

                    String(manager.restaurantId) ===

                    String(editingRestaurantId);



                  const matchesSearch =

                    (manager.name || "")

                      .toLowerCase()

                      .includes(managerSearch.toLowerCase());



                  return (

                    belongsToOwner &&

                    isAvailable &&

                    matchesSearch

                  );

                }).length === 0 && (

                  <p className="px-4 py-3 text-sm text-gray-500">

                    No manager found

                  </p>

                )}



              </div>

            )}

          </div>



          {/* BUTTONS */}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">



            <button

              type="button"

              onClick={() => {

                setIsModalOpen(false);

                setEmailError("");

                setStateSearch("");

                setCitySearch("");

                setManagerSearch("");

                setIsManagerDropdownOpen(false);

              }}

              className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-secondary"

            >

              Cancel

            </button>



            <button

              type="button"

              onClick={handleCreateRestaurant}

              disabled={!!emailError}

              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"

            >

              {editingRestaurantId !== null

                ? "Update Restaurant"

                : "Create Restaurant"}

            </button>



          </div>



        </div>

      </div>

    </div>

  </div>

)}



{/* ===================================== */}

{/* DELETE CONFIRMATION MODAL */}

{/* ===================================== */}



{deletingRestaurantId !== null && (

  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">



      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">

        <Trash2 size={22} className="text-red-600" />

      </div>



      <h2 className="mt-4 text-xl font-bold text-gray-900">

        Delete Restaurant?

      </h2>



      <p className="mt-2 text-sm leading-6 text-gray-600">

        Are you sure you want to delete{" "}

        <span className="font-semibold text-gray-900">

          {restaurantList.find(

            (restaurant) =>

              String(restaurant.id) ===

              String(deletingRestaurantId)

          )?.name || "this restaurant"}

        </span>

        ? This action cannot be undone.

      </p>



      <div className="mt-6 flex justify-end gap-3">

        <button

          type="button"

          onClick={handleCancelDelete}

          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"

        >

          Cancel

        </button>



        <button

          type="button"

          onClick={handleDeleteRestaurant}

          className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"

        >

          Delete Restaurant

        </button>

      </div>



    </div>

  </div>

)}

    </main>
  </div>
  );
}
