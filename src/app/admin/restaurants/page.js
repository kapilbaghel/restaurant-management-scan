"use client";
import { City, State } from "country-state-city";
import {  } from "lucide-react";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { restaurants as initialRestaurants } from "@/data/restaurants";



export default function RestaurantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restaurantList, setRestaurantList] = useState(initialRestaurants);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);
  const [deletingRestaurantId, setDeletingRestaurantId] = useState(null);
 const [ownerList, setOwnerList] = useState([]);
const [restaurantEmailError, setRestaurantEmailError] = useState("");
const [ownerEmailError, setOwnerEmailError] = useState("");
const [restaurantCitySearch, setRestaurantCitySearch] = useState("");
const [ownerCitySearch, setOwnerCitySearch] = useState("");
const [restaurantStateSearch, setRestaurantStateSearch] = useState("");
const [ownerStateSearch, setOwnerStateSearch] = useState("");

const indiaCities = City.getCitiesOfCountry("IN");
const indiaStates = State.getStatesOfCountry("IN");

//  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
// const [showOwnerConfirmPassword, setShowOwnerConfirmPassword] = useState(false);


  const [restaurantForm, setRestaurantForm] = useState({
  // Restaurant Details
  name: "",
  gstNumber: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  status: "Active",

  // Owner Details
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  // ownerPassword: "",
  // ownerConfirmPassword: "",
  ownerAddress: "",
  ownerCity: "",
  ownerState: "",
  ownerPincode: "",
  ownerPan: "",
  ownerAadhaar: "",

  ownerPanDocument: null,
ownerAadhaarDocument: null,

  // Temporary - abhi existing code ke liye
  ownerId: "",

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


const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
};


const handleCreateRestaurant = async () => {
  // =========================
  // EDIT RESTAURANT
  // =========================
  if (editingRestaurantId) {
    const updatedRestaurants = restaurantList.map((restaurant) =>
      restaurant.id === editingRestaurantId
        ? {
            ...restaurant,
            name: restaurantForm.name,
            gstNumber: restaurantForm.gstNumber,
            phone: restaurantForm.phone,
            email: restaurantForm.email,
            address: restaurantForm.address,
            city: restaurantForm.city,
            state: restaurantForm.state,
            pincode: restaurantForm.pincode,
            status: restaurantForm.status,
          }
        : restaurant
    );

    setRestaurantList(updatedRestaurants);

    localStorage.setItem(
      "restaurants",
      JSON.stringify(updatedRestaurants)
    );



    setIsModalOpen(false);
    setEditingRestaurantId(null);

    return;
  }

  // =========================
  // REQUIRED FIELD VALIDATION
  // =========================
  if (
    !restaurantForm.name ||
    !restaurantForm.gstNumber ||
    !restaurantForm.phone ||
    !restaurantForm.email ||
    !restaurantForm.address ||
    !restaurantForm.city ||
    !restaurantForm.state ||
    !restaurantForm.pincode ||
    !restaurantForm.ownerName ||
    !restaurantForm.ownerPhone ||
    !restaurantForm.ownerEmail ||
    // !restaurantForm.ownerPassword ||
    // !restaurantForm.ownerConfirmPassword ||
    !restaurantForm.ownerAddress ||
    !restaurantForm.ownerCity ||
    !restaurantForm.ownerState ||
    !restaurantForm.ownerPincode ||
    !restaurantForm.ownerPan ||
    !restaurantForm.ownerAadhaar
  ) {
    alert("Please fill all required fields.");
    return;
  }

  const restaurantEmailValidationError = validateEmail(
  restaurantForm.email
);

if (restaurantEmailValidationError) {
  setRestaurantEmailError(restaurantEmailValidationError);
  return;
}

const ownerEmailValidationError = validateEmail(
  restaurantForm.ownerEmail
);

if (ownerEmailValidationError) {
  setOwnerEmailError(ownerEmailValidationError);
  return;
}



//   const password = restaurantForm.ownerPassword;

// const passwordRegex =
//   /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// if (!passwordRegex.test(password)) {
//   alert(
//     "Password must be at least 8 characters and contain at least 1 capital letter, 1 number and 1 special character."
//   );
//   return;
// }


  // =========================
  // PASSWORD CHECK
  // =========================
  // if (
  //   restaurantForm.ownerPassword !==
  //   restaurantForm.ownerConfirmPassword
  // ) {
  //   alert("Owner passwords do not match.");
  //   return;
  // }

  // =========================
  // CREATE OWNER
  // =========================
  const savedOwners = localStorage.getItem("owners");

  const currentOwners = savedOwners
    ? JSON.parse(savedOwners)
    : [];


const panDocument = restaurantForm.ownerPanDocument
  ? await convertFileToBase64(restaurantForm.ownerPanDocument)
  : null;

const aadhaarDocument = restaurantForm.ownerAadhaarDocument
  ? await convertFileToBase64(restaurantForm.ownerAadhaarDocument)
  : null;


const newOwner = {
  id: Date.now(),

  name: restaurantForm.ownerName,
  phone: restaurantForm.ownerPhone,
  email: restaurantForm.ownerEmail,

  // password: restaurantForm.ownerPassword,

  address: restaurantForm.ownerAddress,
  city: restaurantForm.ownerCity,
  state: restaurantForm.ownerState,
  pincode: restaurantForm.ownerPincode,

  pan: restaurantForm.ownerPan,
  aadhaar: restaurantForm.ownerAadhaar,

  panDocument: panDocument,
  aadhaarDocument: aadhaarDocument,

  status: "Active",
};
  const updatedOwners = [
    ...currentOwners,
    newOwner,
  ];

  localStorage.setItem(
    "owners",
    JSON.stringify(updatedOwners)
  );

  // =========================
  // CREATE RESTAURANT
  // =========================
  const newRestaurant = {
    id: Date.now() + 1,

    name: restaurantForm.name,
    gstNumber: restaurantForm.gstNumber,

    phone: restaurantForm.phone,
    email: restaurantForm.email,

    address: restaurantForm.address,
    city: restaurantForm.city,
    state: restaurantForm.state,
    pincode: restaurantForm.pincode,

    status: restaurantForm.status,

     ownerId: newOwner.id,
  managerId: restaurantForm.managerId,

  branchType: "main",
  parentRestaurantId: null,
   
  };

  const updatedRestaurants = [
    ...restaurantList,
    newRestaurant,
  ];

  setRestaurantList(updatedRestaurants);

  localStorage.setItem(
    "restaurants",
    JSON.stringify(updatedRestaurants)
  );

  // SEND OWNER INVITATION EMAIL
// =========================
try {
  const emailResponse = await fetch("/api/send-owner-invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ownerName: restaurantForm.ownerName,
      ownerEmail: restaurantForm.ownerEmail,
      restaurantName: restaurantForm.name,
    }),
  });

  const emailResult = await emailResponse.json();

  if (!emailResult.success) {

console.error(
  "Owner email failed:",
  JSON.stringify(emailResult, null, 2)
);

  } else {
    console.log("Owner invitation email sent successfully");
  }
} catch (error) {
  console.error("Owner email error:", error);
}

// =========================
// CLOSE MODAL
// =========================
setIsModalOpen(false);
setEditingRestaurantId(null);

// =========================
// RESET FORM
// =========================
setRestaurantForm({
  name: "",
  gstNumber: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  status: "Active",

  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  // ownerPassword: "",
  // ownerConfirmPassword: "",
  ownerAddress: "",
  ownerCity: "",
  ownerState: "",
  ownerPincode: "",
  ownerPan: "",
  ownerAadhaar: "",

  ownerPanDocument: null,
  ownerAadhaarDocument: null,

  ownerId: "",

});

// setShowOwnerPassword(false);
// setShowOwnerConfirmPassword(false);

console.log("Owner and Restaurant saved successfully");
};


useEffect(() => {
  const savedRestaurants = localStorage.getItem("restaurants");

  if (savedRestaurants) {
    setRestaurantList(JSON.parse(savedRestaurants));
  }

  const savedOwners = localStorage.getItem("owners");

  if (savedOwners) {
    setOwnerList(JSON.parse(savedOwners));
  }


}, []);

    useEffect(() => {
  const handleClickOutside = () => {
    setOpenMenuId(null);
  };

  if (openMenuId !== null) {
    document.addEventListener("click", handleClickOutside);
  }

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [openMenuId]);

  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

     <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 lg:p-8">

{/* Header */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  <div>
    <p className="text-sm font-medium text-[#B88945]">
      Management
    </p>

    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171411]">
      Restaurants
    </h1>

    <p className="mt-2 text-sm text-[#716B64]">
      Manage all your restaurants and branches from one place.
    </p>
  </div>

  <button
    onClick={() => {
      setEditingRestaurantId(null);

      setRestaurantForm({
        name: "",
        gstNumber: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        status: "Active",

        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
        // ownerPassword: "",
        // ownerConfirmPassword: "",
        ownerAddress: "",
        ownerCity: "",
        ownerState: "",
        ownerPincode: "",
        ownerPan: "",
        ownerAadhaar: "",

        ownerPanDocument: null,
        ownerAadhaarDocument: null,

        ownerId: "",
        
      });

     setIsModalOpen(true);
    }}
    className="inline-flex items-center justify-center rounded-xl bg-[#D5A960] px-5 py-3 text-sm font-semibold text-[#171411] shadow-sm transition hover:bg-[#C99A52]"
  >
    + Add Restaurant
  </button>

</div>


{/* Overview Cards */}
<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

  <div className="rounded-2xl border border-[#E5DED4] bg-white p-5 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">
    <p className="text-sm text-[#716B64]">
      Total Restaurants
    </p>

    <div className="mt-3 flex items-end justify-between">
      <h2 className="text-3xl font-bold text-[#171411]">
        {restaurantList.length}
      </h2>

      <div className="rounded-xl bg-[#F5E8D4] px-3 py-2 text-xs font-semibold text-[#A87535]">
        All
      </div>
    </div>
  </div>


  <div className="rounded-2xl border border-[#E5DED4] bg-white p-5 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">
    <p className="text-sm text-[#716B64]">
      Active Restaurants
    </p>

    <div className="mt-3 flex items-end justify-between">
      <h2 className="text-3xl font-bold text-[#171411]">
        {
          restaurantList.filter(
            (restaurant) => restaurant.status === "Active"
          ).length
        }
      </h2>

      <div className="rounded-xl bg-[#E8F2EB] px-3 py-2 text-xs font-semibold text-[#3F7D5A]">
        Active
      </div>
    </div>
  </div>


  <div className="rounded-2xl border border-[#E5DED4] bg-white p-5 shadow-[0_8px_30px_rgba(23,20,17,0.04)]">
    <p className="text-sm text-[#716B64]">
      Platform Status
    </p>

    <div className="mt-3 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-[#171411]">
          Operational
        </h2>

        <p className="mt-1 text-xs text-[#716B64]">
          All systems running normally
        </p>
      </div>

      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F2EB]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#3F7D5A]" />
      </span>
    </div>
  </div>

</div>


{/* Restaurant Table */}
<div className="mt-8 overflow-hidden rounded-2xl border border-[#E5DED4] bg-white shadow-[0_8px_30px_rgba(23,20,17,0.04)]">

  {/* Table Header */}
  <div className="flex flex-col gap-2 border-b border-[#E5DED4] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <h2 className="text-lg font-semibold text-[#171411]">
        All Restaurants
      </h2>

      <p className="mt-1 text-sm text-[#716B64]">
        View and manage your restaurant accounts.
      </p>
    </div>

    <span className="text-sm text-[#716B64]">
      {restaurantList.length} restaurants
    </span>

  </div>


  {/* Table */}
  <div className="overflow-x-auto">

    <table className="w-full min-w-[760px]">

      <thead>
        <tr className="border-b border-[#E5DED4] bg-[#FCFAF7]">

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
            Owner
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

      {restaurantList
  .filter(
    (restaurant) =>
      restaurant.branchType === "main" ||
      !restaurant.branchType
  )
  .map((restaurant, index) => {

          const restaurantOwner = ownerList.find(
            (owner) =>
              String(owner.id) ===
              String(restaurant.ownerId)
          );

          return (
            <tr
              key={restaurant.id}
              className="group border-b border-[#EEE8DF] transition last:border-b-0 hover:bg-[#FCFAF7]"
            >

              {/* Number */}
              <td className="px-6 py-5">
                <span className="text-sm font-medium text-[#9A9289]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </td>


              {/* Restaurant */}
              <td className="px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D4] text-sm font-bold text-[#B88945]">
                    {restaurant.name?.charAt(0)?.toUpperCase() || "R"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#171411]">
                      {restaurant.name}
                    </p>

                    <p className="mt-1 text-xs text-[#9A9289]">
                      Restaurant ID: {restaurant.id}
                    </p>
                  </div>

                </div>

              </td>


              {/* Location */}
              <td className="px-6 py-5">

                <p className="text-sm text-[#4F4942]">
                  {restaurant.location ||
                    [restaurant.city, restaurant.state]
                      .filter(Boolean)
                      .join(", ") ||
                    "—"}
                </p>

              </td>


              {/* Owner */}
              <td className="px-6 py-5">

                <p className="text-sm font-medium text-[#171411]">
                  {restaurantOwner?.name || "—"}
                </p>

                {restaurantOwner?.email && (
                  <p className="mt-1 text-xs text-[#9A9289]">
                    {restaurantOwner.email}
                  </p>
                )}

              </td>


              {/* Status */}
              <td className="px-6 py-5">

                <span
                  className={
                    restaurant.status === "Active"
                      ? "inline-flex items-center gap-2 rounded-full bg-[#E8F2EB] px-3 py-1.5 text-xs font-semibold text-[#3F7D5A]"
                      : "inline-flex items-center gap-2 rounded-full bg-[#FBEAEA] px-3 py-1.5 text-xs font-semibold text-[#C85C5C]"
                  }
                >
                  <span
                    className={
                      restaurant.status === "Active"
                        ? "h-1.5 w-1.5 rounded-full bg-[#3F7D5A]"
                        : "h-1.5 w-1.5 rounded-full bg-[#C85C5C]"
                    }
                  />

                  {restaurant.status}
                </span>

              </td>


              {/* Actions */}
              <td className="px-6 py-5">

                <div className="flex items-center justify-end gap-3">

                  <a
                    href={`/admin/restaurants/${restaurant.id}`}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[#B88945] transition hover:bg-[#F5E8D4] hover:text-[#171411]"
                  >
                    View
                  </a>


                  {/* 3 Dot Menu */}
                  <div className="relative">

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpenMenuId(
                          openMenuId === restaurant.id
                            ? null
                            : restaurant.id
                        );
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[#716B64] transition hover:bg-[#F5E8D4] hover:text-[#171411]"
                    >
                      ⋮
                    </button>


                    {openMenuId === restaurant.id && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-xl border border-[#E5DED4] bg-white p-1.5 shadow-[0_15px_40px_rgba(23,20,17,0.12)]">

                        <button
                          type="button"
                          onClick={() => {
                            setEditingRestaurantId(
                              restaurant.id
                            );

                            setRestaurantForm({
                              name: restaurant.name || "",
                              gstNumber:
                                restaurant.gstNumber || "",
                              phone:
                                restaurant.phone || "",
                              email:
                                restaurant.email || "",
                              address:
                                restaurant.address || "",
                              city:
                                restaurant.city || "",
                              state:
                                restaurant.state || "",
                              pincode:
                                restaurant.pincode || "",
                              status:
                                restaurant.status ||
                                "Active",

                              ownerName: "",
                              ownerPhone: "",
                              ownerEmail: "",
                              // ownerPassword: "",
                              // ownerConfirmPassword: "",
                              ownerAddress: "",
                              ownerCity: "",
                              ownerState: "",
                              ownerPincode: "",
                              ownerPan: "",
                              ownerAadhaar: "",

                              ownerPanDocument: null,
                              ownerAadhaarDocument: null,

                              ownerId:
                                restaurant.ownerId || "",
                            });

                            setOpenMenuId(null);
                            setIsModalOpen(true);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#4F4942] transition hover:bg-[#F7F4EE]"
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          onClick={() => {
                            setDeletingRestaurantId(
                              restaurant.id
                            );
                            setOpenMenuId(null);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#C85C5C] transition hover:bg-[#FBEAEA]"
                        >
                          Delete
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              </td>

            </tr>
          );
        })}

      </tbody>

    </table>

  </div>

</div>

      </main>

{isModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#171411]/50 p-4 backdrop-blur-sm"
    onClick={() => {
      setIsModalOpen(false);
      setEditingRestaurantId(null);
    }}
  >
    {/* MODAL */}
    <div
      className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#E5DED4] bg-[#FDFCFA] shadow-[0_25px_80px_rgba(23,20,17,0.20)]"
      onClick={(event) => event.stopPropagation()}
    >

      {/* ================= HEADER ================= */}
      <div className="shrink-0 border-b border-[#E8E1D8] bg-white px-7 py-6">
        <div className="flex items-start justify-between gap-5">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D5A960]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B88945]">
                Restaurant Management
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#171411]">
              {editingRestaurantId
                ? "Edit Restaurant"
                : "Add Restaurant"}
            </h2>

            <p className="mt-1.5 text-sm text-[#716B64]">
              {editingRestaurantId
                ? "Update restaurant information and account details."
                : "Create a new restaurant and owner account."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setEditingRestaurantId(null);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5DED4] bg-white text-xl text-[#716B64] transition hover:border-[#D5A960] hover:bg-[#F7F4EE] hover:text-[#171411]"
          >
            ×
          </button>

        </div>
      </div>


      {/* ================= SCROLLABLE FORM ================= */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-8 px-7 py-7">

          {/* ================================================= */}
          {/* RESTAURANT INFORMATION */}
          {/* ================================================= */}

          <section>

            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D4] text-sm font-bold text-[#B88945]">
                01
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#171411]">
                  Restaurant Information
                </h3>

                <p className="mt-1 text-sm text-[#716B64]">
                  Enter the basic details of the restaurant.
                </p>
              </div>
            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Restaurant Name */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Restaurant Name
                  <span className="ml-1 text-[#C85C5C]">*</span>
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
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* GST */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  GST Number
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter GST number"
                  value={restaurantForm.gstNumber}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      gstNumber: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm uppercase text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* Phone */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Phone
                  <span className="ml-1 text-[#C85C5C]">*</span>
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
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Email
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={restaurantForm.email}
              onChange={(e) => {
  const value = e.target.value;

  setRestaurantForm({
    ...restaurantForm,
    email: value,
  });

  setRestaurantEmailError(validateEmail(value));
}}
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />

{restaurantEmailError && (
  <p className="mt-2 text-sm text-red-500">
    ⚠ {restaurantEmailError}
  </p>
)}

              </div>


              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-[#3F3933]">
                  Address
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter complete restaurant address"
                  value={restaurantForm.address}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      address: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* City */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  City
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

<div className="relative">
  <input
    type="text"
    placeholder="Search city"
    value={restaurantForm.city || restaurantCitySearch}
    onChange={(e) => {
      setRestaurantCitySearch(e.target.value);

      setRestaurantForm({
        ...restaurantForm,
        city: "",
      });
    }}
    className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
  />

  {restaurantCitySearch && (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
      {indiaCities
        .filter((city) =>
          city.name
            .toLowerCase()
            .includes(restaurantCitySearch.toLowerCase())
        )
        .slice(0, 10)
        .map((city) => (
          <button
            key={`${city.name}-${city.stateCode}`}
            type="button"
            onClick={() => {
              setRestaurantForm({
                ...restaurantForm,
                city: city.name,
              });

              setRestaurantCitySearch("");
            }}
            className="block w-full px-4 py-3 text-left hover:bg-[#F5E8D4]"
          >
            {city.name}
          </button>
        ))}
    </div>
  )}
</div>
              </div>


              {/* State */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  State
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

             <div className="relative">
  <input
    type="text"
    placeholder="Search state"
    value={restaurantForm.state || restaurantStateSearch}
    onChange={(e) => {
      setRestaurantStateSearch(e.target.value);

      setRestaurantForm({
        ...restaurantForm,
        state: "",
      });
    }}
    className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
  />

  {restaurantStateSearch && (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#DED5CA] bg-white shadow-lg">
      {indiaStates
        .filter((state) =>
          state.name
            .toLowerCase()
            .includes(restaurantStateSearch.toLowerCase())
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

              setRestaurantStateSearch("");
            }}
            className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F5E8D4]"
          >
            {state.name}
          </button>
        ))}
    </div>
  )}
</div>
              </div>


              {/* Pincode */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Pincode
                  <span className="ml-1 text-[#C85C5C]">*</span>
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
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Status
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <select
                  value={restaurantForm.status}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      status: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>



            </div>
          </section>


          {/* ================================================= */}
          {/* OWNER INFORMATION */}
          {/* ================================================= */}

          <section className="border-t border-[#E8E1D8] pt-8">

            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D4] text-sm font-bold text-[#B88945]">
                02
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#171411]">
                  Owner Information
                </h3>

                <p className="mt-1 text-sm text-[#716B64]">
                  Enter the owner&apos;s personal and contact details.
                </p>
              </div>
            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Owner Name */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Owner Name
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter owner name"
                  value={restaurantForm.ownerName}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      ownerName: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* Owner Phone */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Owner Phone
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="tel"
                  placeholder="Enter owner phone"
                  value={restaurantForm.ownerPhone}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      ownerPhone: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* Owner Email */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-[#3F3933]">
                  Owner Email
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="email"
                  placeholder="Enter owner email"
                  value={restaurantForm.ownerEmail}
              onChange={(e) => {
  const value = e.target.value;

  setRestaurantForm({
    ...restaurantForm,
    ownerEmail: value,
  });

  setOwnerEmailError(validateEmail(value));
}}
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />

                {ownerEmailError && (
  <p className="mt-2 text-sm text-red-500">
    ⚠ {ownerEmailError}
  </p>
)}

                <p className="mt-2 text-xs text-[#8B837A]">
                  An invitation will be sent to this email so the owner can set their password.
                </p>
              </div>


              {/* Owner Address */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-[#3F3933]">
                  Owner Address
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter complete owner address"
                  value={restaurantForm.ownerAddress}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      ownerAddress: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* Owner City */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  City
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

<div className="relative">
  <input
    type="text"
    placeholder="Search owner city"
    value={restaurantForm.ownerCity || ownerCitySearch}
    onChange={(e) => {
      setOwnerCitySearch(e.target.value);

      setRestaurantForm({
        ...restaurantForm,
        ownerCity: "",
      });
    }}
    className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"
  />

  {ownerCitySearch && (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
      {indiaCities
        .filter((city) =>
          city.name
            .toLowerCase()
            .includes(ownerCitySearch.toLowerCase())
        )
        .slice(0, 10)
        .map((city) => (
          <button
            key={`${city.name}-${city.stateCode}`}
            type="button"
            onClick={() => {
              setRestaurantForm({
                ...restaurantForm,
                ownerCity: city.name,
              });

              setOwnerCitySearch("");
            }}
            className="block w-full px-4 py-3 text-left hover:bg-[#F5E8D4]"
          >
            {city.name}
          </button>
        ))}
    </div>
  )}
</div>
              </div>


              {/* Owner State */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  State
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

<div className="relative">
  <input
    type="text"
    placeholder="Search owner state"
    value={restaurantForm.ownerState || ownerStateSearch}
    onChange={(e) => {
      setOwnerStateSearch(e.target.value);

      setRestaurantForm({
        ...restaurantForm,
        ownerState: "",
      });
    }}
    className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
  />

  {ownerStateSearch && (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#DED5CA] bg-white shadow-lg">
      {indiaStates
        .filter((state) =>
          state.name
            .toLowerCase()
            .includes(ownerStateSearch.toLowerCase())
        )
        .slice(0, 10)
        .map((state) => (
          <button
            key={state.isoCode}
            type="button"
            onClick={() => {
              setRestaurantForm({
                ...restaurantForm,
                ownerState: state.name,
              });

              setOwnerStateSearch("");
            }}
            className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F5E8D4]"
          >
            {state.name}
          </button>
        ))}
    </div>
  )}
</div>
              </div>


              {/* Owner Pincode */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Pincode
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter owner pincode"
                  value={restaurantForm.ownerPincode}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      ownerPincode: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>

            </div>
          </section>


          {/* ================================================= */}
          {/* IDENTITY & DOCUMENTS */}
          {/* ================================================= */}

          <section className="border-t border-[#E8E1D8] pt-8">

            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D4] text-sm font-bold text-[#B88945]">
                03
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#171411]">
                  Identity &amp; Documents
                </h3>

                <p className="mt-1 text-sm text-[#716B64]">
                  Add the owner&apos;s PAN and Aadhaar information.
                </p>
              </div>
            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* PAN */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Owner PAN
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter PAN number"
                  value={restaurantForm.ownerPan}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      ownerPan: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm uppercase text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* Aadhaar */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Owner Aadhaar
                  <span className="ml-1 text-[#C85C5C]">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter Aadhaar number"
                  value={restaurantForm.ownerAadhaar}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      ownerAadhaar: e.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#DED5CA] bg-white px-4 text-sm text-[#171411] outline-none transition placeholder:text-[#AAA29A] focus:border-[#D5A960] focus:ring-4 focus:ring-[#D5A960]/10"
                />
              </div>


              {/* PAN Document */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  PAN Document
                </label>

                <div className="mt-2 rounded-xl border border-dashed border-[#D8CFC4] bg-white p-4 transition hover:border-[#D5A960] hover:bg-[#FFFCF8]">

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) =>
                      setRestaurantForm({
                        ...restaurantForm,
                        ownerPanDocument:
                          e.target.files?.[0] || null,
                      })
                    }
                    className="w-full text-sm text-[#716B64] file:mr-4 file:rounded-lg file:border-0 file:bg-[#F5E8D4] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#A87535] hover:file:bg-[#EEDDBF]"
                  />

                  {restaurantForm.ownerPanDocument && (
                    <p className="mt-2 truncate text-xs text-[#716B64]">
                      Selected: {restaurantForm.ownerPanDocument.name}
                    </p>
                  )}

                </div>
              </div>


              {/* Aadhaar Document */}
              <div>
                <label className="text-sm font-semibold text-[#3F3933]">
                  Aadhaar Document
                </label>

                <div className="mt-2 rounded-xl border border-dashed border-[#D8CFC4] bg-white p-4 transition hover:border-[#D5A960] hover:bg-[#FFFCF8]">

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) =>
                      setRestaurantForm({
                        ...restaurantForm,
                        ownerAadhaarDocument:
                          e.target.files?.[0] || null,
                      })
                    }
                    className="w-full text-sm text-[#716B64] file:mr-4 file:rounded-lg file:border-0 file:bg-[#F5E8D4] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#A87535] hover:file:bg-[#EEDDBF]"
                  />

                  {restaurantForm.ownerAadhaarDocument && (
                    <p className="mt-2 truncate text-xs text-[#716B64]">
                      Selected: {restaurantForm.ownerAadhaarDocument.name}
                    </p>
                  )}

                </div>
              </div>

            </div>
          </section>


          {/* INFO NOTE */}
          <div className="rounded-2xl border border-[#EADCC7] bg-[#FCF7EE] px-5 py-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5E8D4] text-xs font-bold text-[#B88945]">
                i
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4F4942]">
                  Owner account setup
                </p>

                <p className="mt-1 text-xs leading-5 text-[#716B64]">
                  The owner will receive an invitation email and can create
                  their password through the secure setup process.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* ================= FIXED FOOTER ================= */}
      <div className="shrink-0 border-t border-[#E8E1D8] bg-white px-7 py-4">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="hidden text-xs text-[#9A9289] sm:block">
            <span className="text-[#C85C5C]">*</span> Required fields
          </p>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingRestaurantId(null);
              }}
              className="rounded-xl border border-[#DED5CA] bg-white px-5 py-2.5 text-sm font-semibold text-[#4F4942] transition hover:bg-[#F7F4EE]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateRestaurant}
              className="rounded-xl bg-[#D5A960] px-6 py-2.5 text-sm font-semibold text-[#171411] shadow-sm transition hover:bg-[#C99A52] hover:shadow-md"
            >
              {editingRestaurantId
                ? "Update Restaurant"
                : "Create Restaurant"}
            </button>

          </div>
        </div>
      </div>

    </div>
  </div>
)}

{deletingRestaurantId && (
  <div
    className="fixed inset-0 z-[60] flex items-center justify-center bg-[#171411]/50 p-4 backdrop-blur-sm"
    onClick={() => setDeletingRestaurantId(null)}
  >
    <div
      className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5DED4] bg-[#FDFCFA] shadow-[0_25px_80px_rgba(23,20,17,0.22)]"
      onClick={(event) => event.stopPropagation()}
    >

      {/* ================= HEADER ================= */}
      <div className="px-7 pt-7">

        <div className="flex items-start justify-between">

          {/* DELETE ICON */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBEAEA]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6 text-[#C85C5C]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 6l-1 14a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20L5 6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 10v7M14 10v7"
              />
            </svg>
          </div>


          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={() => setDeletingRestaurantId(null)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-[#9A9289] transition hover:bg-[#F7F4EE] hover:text-[#171411]"
          >
            ×
          </button>

        </div>


        {/* TITLE */}
        <div className="mt-6">

          <h2 className="text-xl font-bold tracking-tight text-[#171411]">
            Delete Restaurant?
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#716B64]">
            This action will permanently remove the restaurant
            from your restaurant list.
          </p>

        </div>

      </div>


      {/* ================= RESTAURANT ================= */}
      <div className="px-7 py-6">

        <div className="rounded-2xl border border-[#E8E1D8] bg-white p-4">

          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9A9289]">
            Restaurant
          </p>

          <div className="mt-3 flex items-center gap-3">

            {/* AVATAR */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D4] text-sm font-bold text-[#B88945]">
              {restaurantList
                .find(
                  (restaurant) =>
                    restaurant.id === deletingRestaurantId
                )
                ?.name?.charAt(0)
                ?.toUpperCase() || "R"}
            </div>


            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-[#171411]">
                {
                  restaurantList.find(
                    (restaurant) =>
                      restaurant.id === deletingRestaurantId
                  )?.name
                }
              </p>

              <p className="mt-1 text-xs text-[#9A9289]">
                Restaurant ID: {deletingRestaurantId}
              </p>

            </div>

          </div>

        </div>


        {/* WARNING */}
        <div className="mt-4 rounded-xl border border-[#F0D8D8] bg-[#FFF7F7] px-4 py-3">

          <div className="flex gap-3">

            <div className="mt-0.5 shrink-0 text-[#C85C5C]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 17h.01"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.3 3.7 2.8 17a2 2 0 0 0 1.75 3h14.9a2 2 0 0 0 1.75-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </div>

            <p className="text-xs leading-5 text-[#8B5E5E]">
              This action cannot be undone. Make sure you want to
              permanently delete this restaurant.
            </p>

          </div>

        </div>

      </div>


      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-end gap-3 border-t border-[#E8E1D8] bg-white px-7 py-4">

        {/* CANCEL */}
        <button
          type="button"
          onClick={() => setDeletingRestaurantId(null)}
          className="rounded-xl border border-[#DED5CA] bg-white px-5 py-2.5 text-sm font-semibold text-[#4F4942] transition hover:bg-[#F7F4EE]"
        >
          Cancel
        </button>


        {/* DELETE */}
        <button
          type="button"
          onClick={() => {

            const updatedRestaurants =
              restaurantList.filter(
                (restaurant) =>
                  restaurant.id !== deletingRestaurantId
              );

            setRestaurantList(updatedRestaurants);

            localStorage.setItem(
              "restaurants",
              JSON.stringify(updatedRestaurants)
            );

            setDeletingRestaurantId(null);
          }}
          className="rounded-xl bg-[#C85C5C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B94F4F] hover:shadow-md"
        >
          Delete Restaurant
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}