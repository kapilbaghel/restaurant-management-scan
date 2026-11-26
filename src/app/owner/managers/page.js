"use client";



import { useContext, useEffect, useState } from "react";

import OwnerSidebar from "@/components/owner/OwnerSidebar";

import { X, Eye, EyeOff } from "lucide-react";





export default function ManagersPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);



  const [managerList, setManagerList] = useState([]);



const [restaurantList, setRestaurantList] = useState([]);



  const [openMenuId, setOpenMenuId] = useState(null);



  const [editingManagerId, setEditingManagerId] = useState(null);



  const [deletingManagerId, setDeletingManagerId] = useState(null);



  const [currentOwnerId, setCurrentOwnerId] = useState(null);



  const [showPassword, setShowPassword] = useState(false);



const [showConfirmPassword, setShowConfirmPassword] = useState(false);



const [managerForm, setManagerForm] = useState({

  name: "",

  phone: "",

  email: "",

    password: "",

  confirmPassword: "",

  dateOfBirth: "",

  maritalStatus: "",



  permanentAddress: "",

  correspondenceAddress: "",



  qualification: "",

  otherQualification: "",

  workExperience: "",

  // restaurant: "",

  status: "Active",

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



const [managerPhoto, setManagerPhoto] = useState("");

const [emailError, setEmailError] = useState("");

const [managerAadhaar, setManagerAadhaar] = useState([]);

const [managerPan, setManagerPan] = useState([]);

const [managerEducation, setManagerEducation] = useState([]);

const [managerExperienceLetter, setManagerExperienceLetter] = useState([]);



  // Load saved managers from Local Storage

 useEffect(() => {

  // Get logged-in owner

  const loggedInOwnerId = localStorage.getItem("loggedInOwnerId");



  if (!loggedInOwnerId) {

    window.location.href = "/login";

    return;

  }



  setCurrentOwnerId(loggedInOwnerId);



  // Load managers

  const savedManagers = localStorage.getItem("managers");



  if (savedManagers) {

    setManagerList(JSON.parse(savedManagers));

  }



  // Load restaurants

  const savedRestaurants = localStorage.getItem("restaurants");



  if (savedRestaurants) {

    setRestaurantList(JSON.parse(savedRestaurants));

  }

}, []);



// Load managers from MongoDB

useEffect(() => {

  const loadManagers = async () => {

    const loggedInOwnerId = localStorage.getItem("loggedInOwnerId");



    if (!loggedInOwnerId) {

      window.location.href = "/login";

      return;

    }



    setCurrentOwnerId(loggedInOwnerId);



    try {

      const response = await fetch("/api/owners/managers", {

        method: "GET",

        credentials: "include",

      });



      const data = await response.json();



      if (!response.ok || !data.success) {

        console.error("Unable to fetch managers:", data.message);

        alert(data.message || "Unable to load managers.");

        return;

      }



      setManagerList(data.managers || []);

    } catch (error) {

      console.error("Load managers error:", error);

      alert("Something went wrong while loading managers.");

    }



    // Restaurants are still loaded from Local Storage

    const savedRestaurants = localStorage.getItem("restaurants");



    if (savedRestaurants) {

      setRestaurantList(JSON.parse(savedRestaurants));

    }

  };



  loadManagers();

}, []);





const handleEditManager = (manager) => {

  setEditingManagerId(manager.id);



setManagerForm({

  name: manager.name || "",

  phone: manager.phone || "",



  email: manager.email || "",



    password: "",

  confirmPassword: "",



  dateOfBirth: manager.dateOfBirth || "",

  maritalStatus: manager.maritalStatus || "",



  permanentAddress: manager.permanentAddress || "",

  correspondenceAddress: manager.correspondenceAddress || "",



  qualification: manager.qualification || "",

  otherQualification: manager.otherQualification || "",

  workExperience: manager.workExperience || "",





  status: manager.status || "Active",

});



  setManagerPhoto(manager.photo || "");

 setManagerAadhaar(manager.aadhaar || []);

setManagerPan(

  Array.isArray(manager.pan)

    ? manager.pan

    : manager.pan

      ? [manager.pan]

      : []

);



setManagerEducation(

  Array.isArray(manager.educationCertificates)

    ? manager.educationCertificates

    : []

);



setManagerExperienceLetter(

  Array.isArray(manager.experienceLetters)

    ? manager.experienceLetters

    : []

);







  setOpenMenuId(null);

  setIsModalOpen(true);

};





const handleDeleteManager=()=>{

const updatedManagers = managerList.filter(

  (manager)=> manager.id !== deletingManagerId);



setManagerList(updatedManagers);



localStorage.setItem(

  "managers",

  JSON.stringify(updatedManagers)

);



setDeletingManagerId(null);



}







const handleUpdateManager = async () => {

  if (

    !managerForm.name ||

    !managerForm.phone ||

    !managerForm.email

  ) {

    alert("Please fill all required fields.");

    return;

  }



  const emailValidationError = validateEmail(managerForm.email);



  if (emailValidationError) {

    setEmailError(emailValidationError);

    return;

  }



  if (

    (managerForm.password || managerForm.confirmPassword) &&

    managerForm.password !== managerForm.confirmPassword

  ) {

    alert("Password and Confirm Password do not match!");

    return;

  }



  // Update password in MongoDB only when a new password is entered

  if (managerForm.password) {

    try {

      const response = await fetch("/api/owners/managers", {

        method: "PUT",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          managerId: editingManagerId,

          password: managerForm.password,

          confirmPassword: managerForm.confirmPassword,

        }),

      });



      const data = await response.json();



      if (!response.ok || !data.success) {

        alert(data.message || "Unable to update manager password.");

        return;

      }

    } catch (error) {

      console.error("Password update error:", error);

      alert("Something went wrong while updating password.");

      return;

    }

  }



  // Update remaining manager details in local state

  const updatedManagers = managerList.map((manager) =>

    manager.id === editingManagerId

      ? {

          ...manager,

          name: managerForm.name,

          phone: managerForm.phone,

          email: managerForm.email,

          photo: managerPhoto,

          aadhaar: managerAadhaar,

          pan: managerPan,

          educationCertificates: managerEducation,

          experienceLetters: managerExperienceLetter,

          dateOfBirth: managerForm.dateOfBirth,

          maritalStatus: managerForm.maritalStatus,

          permanentAddress: managerForm.permanentAddress,

          correspondenceAddress: managerForm.correspondenceAddress,

          qualification: managerForm.qualification,

          otherQualification: managerForm.otherQualification,

          workExperience: managerForm.workExperience,

          status: managerForm.status,

        }

      : manager

  );



  setManagerList(updatedManagers);



  localStorage.setItem(

    "managers",

    JSON.stringify(updatedManagers)

  );



  setIsModalOpen(false);

  setEditingManagerId(null);



  setManagerForm({

    name: "",

    phone: "",

    email: "",

    password: "",

    confirmPassword: "",

    dateOfBirth: "",

    maritalStatus: "",

    permanentAddress: "",

    correspondenceAddress: "",

    qualification: "",

    otherQualification: "",

    workExperience: "",

    status: "Active",

  });



  alert(

    managerForm.password

      ? "Manager details and password updated successfully!"

      : "Manager details updated successfully!"

  );

};









  // Create Manager





const handleCreateManager = async () => {

  if (

    !managerForm.name.trim() ||

    !managerForm.phone.trim() ||

    !managerForm.email.trim()

  ) {

    alert("Please fill all required fields.");

    return;

  }



  const emailValidationError = validateEmail(managerForm.email);



  if (emailValidationError) {

    setEmailError(emailValidationError);

    return;

  }



  if (!managerForm.password) {

    alert("Please enter a password.");

    return;

  }



  if (managerForm.password !== managerForm.confirmPassword) {

    alert("Password and Confirm Password do not match!");

    return;

  }



  try {

    const formData = new FormData();



    // Basic manager details

    formData.append("name", managerForm.name.trim());

    formData.append("phone", managerForm.phone.trim());

    formData.append("email", managerForm.email.trim());

    formData.append("password", managerForm.password);



    // Personal details

    formData.append("dateOfBirth", managerForm.dateOfBirth || "");

    formData.append("maritalStatus", managerForm.maritalStatus || "");

    formData.append("permanentAddress", managerForm.permanentAddress || "");

    formData.append("correspondenceAddress", managerForm.correspondenceAddress || "");

    formData.append("qualification", managerForm.qualification || "");

    formData.append("otherQualification", managerForm.otherQualification || "");

    formData.append("workExperience", managerForm.workExperience || "");

    formData.append("status", managerForm.status || "Active");



    // Profile photo

    if (managerPhoto instanceof File) {

      formData.append("photo", managerPhoto);

    }



    // Aadhaar documents

    managerAadhaar.forEach((file) => {

      if (file instanceof File) {

        formData.append("aadhaar", file);

      }

    });



    // PAN documents

    managerPan.forEach((file) => {

      if (file instanceof File) {

        formData.append("pan", file);

      }

    });



    // Education certificates

    managerEducation.forEach((file) => {

      if (file instanceof File) {

        formData.append("educationCertificates", file);

      }

    });



    // Experience letters

    managerExperienceLetter.forEach((file) => {

      if (file instanceof File) {

        formData.append("experienceLetters", file);

      }

    });



    const response = await fetch("/api/owners/managers", {

      method: "POST",

      credentials: "include",

      body: formData,

    });



    const data = await response.json();



    if (!response.ok || !data.success) {

      alert(data.message || "Unable to create manager.");

      return;

    }



    const newManager = {

      ...data.manager,

      dateOfBirth: managerForm.dateOfBirth,

      maritalStatus: managerForm.maritalStatus,

      permanentAddress: managerForm.permanentAddress,

      correspondenceAddress: managerForm.correspondenceAddress,

      qualification: managerForm.qualification,

      otherQualification: managerForm.otherQualification,

      workExperience: managerForm.workExperience,

    };



    setManagerList((prev) => [...prev, newManager]);



    setIsModalOpen(false);



    setManagerForm({

      name: "",

      phone: "",

      email: "",

      password: "",

      confirmPassword: "",

      dateOfBirth: "",

      maritalStatus: "",

      permanentAddress: "",

      correspondenceAddress: "",

      qualification: "",

      otherQualification: "",

      workExperience: "",

      status: "Active",

    });



    // Reset uploaded documents

    setManagerPhoto("");

    setManagerAadhaar([]);

    setManagerPan([]);

    setManagerEducation([]);

    setManagerExperienceLetter([]);



    setEmailError("");



    console.log("Manager saved in MongoDB:", newManager);



    alert("Manager created successfully.");

  } catch (error) {

    console.error("Create manager error:", error);

    alert("Something went wrong while creating manager.");

  }

};





return (

  <div className="flex min-h-screen bg-[#F7F3ED] text-[#17211D]">

    <OwnerSidebar />



    <main className="ml-64 min-h-screen flex-1 bg-[#F7F3ED] px-8 py-8">

      {/* Page Header */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#14231E]">

            Managers

          </h1>



          <p className="mt-2 text-sm text-[#7C817D]">

            Manage all restaurant managers from here.

          </p>

        </div>



        <button

          type="button"

          onClick={() => {

  setEmailError("");

  setIsModalOpen(true);

}}

          className="inline-flex items-center justify-center rounded-xl bg-[#D6A45F] px-6 py-3 text-sm font-semibold text-[#17211D] shadow-sm transition hover:bg-[#C9954E] hover:shadow-md"

        >

          + Add Manager

        </button>

      </div>



      {/* Manager Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-[#E9DED0] bg-white p-6 shadow-[0_8px_30px_rgba(39,29,16,0.04)]">
          <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-[#F7EBDD]" />
          <div className="relative">
            <p className="text-sm font-medium text-[#77766F]">Total Managers</p>
            <p className="mt-3 text-4xl font-bold tracking-tight text-[#14231E]">{managerList.length}</p>
            <p className="mt-2 text-xs text-[#A66B2D]">Managers registered under your account</p>
            <div className="mt-5 h-1 rounded-full bg-[#D6A45F]" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#E9DED0] bg-white p-6 shadow-[0_8px_30px_rgba(39,29,16,0.04)]">
          <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-[#E7F1EB]" />
          <div className="relative">
            <p className="text-sm font-medium text-[#77766F]">Active Managers</p>
            <p className="mt-3 text-4xl font-bold tracking-tight text-[#087B52]">{managerList.filter((manager) => manager.status === "Active").length}</p>
            <p className="mt-2 flex items-center gap-2 text-xs text-[#087B52]"><span className="h-2 w-2 rounded-full bg-[#087B52]" />Currently active</p>
            <div className="mt-5 h-1 rounded-full bg-[#087B52]" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#E9DED0] bg-white p-6 shadow-[0_8px_30px_rgba(39,29,16,0.04)]">
          <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-[#F9E9E8]" />
          <div className="relative">
            <p className="text-sm font-medium text-[#77766F]">Inactive Managers</p>
            <p className="mt-3 text-4xl font-bold tracking-tight text-[#D64545]">{managerList.filter((manager) => manager.status !== "Active").length}</p>
            <p className="mt-2 flex items-center gap-2 text-xs text-[#D64545]"><span className="h-2 w-2 rounded-full bg-[#D64545]" />Currently unavailable</p>
            <div className="mt-5 h-1 rounded-full bg-[#D64545]" />
          </div>
        </div>
      </div>

      {/* Managers Table */}

      <div className="mt-7 overflow-hidden rounded-2xl border border-[#E9DED0] bg-white shadow-[0_8px_30px_rgba(39,29,16,0.05)]">

        <div className="overflow-x-auto"><table className="w-full min-w-[1050px]">

          <thead>

            <tr className="border-b border-[#EFE6DC] bg-[#F8F4EE]">



              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

      S.No.

    </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

                Manager

              </th>



              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

  Manager ID

</th>



              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

                Phone

              </th>



              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

                Email

              </th>



              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

                Restaurant

              </th>



              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

  Branch

</th>



              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

                Status

              </th>



              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#77766F]">

              Actions

              </th>



            </tr>

          </thead>



          <tbody>

            {managerList.length === 0 ? (

              <tr>

                <td

                  colSpan="8"

                  className="px-5 py-10 text-center text-sm text-muted-foreground"

                >

                  No managers found.

                </td>

              </tr>

            ) : (

              managerList.map((manager,index) => (

                <tr

                  key={manager.id}

                  className="border-b border-[#F0E8DF] last:border-b-0 hover:bg-[#FCFAF7]"

                >



                  <td className="px-5 py-4 text-sm text-[#555D58]">

                  {index + 1}

                  </td>



                  <td className="px-5 py-4 font-semibold text-[#17211D]">

                    {manager.name}

                  </td>



                  <td className="px-5 py-4 text-sm font-semibold text-[#B98543]">

  {manager.managerCode || "Not Generated"}

</td>



                  <td className="px-5 py-4 text-sm text-[#555D58]">

                    {manager.phone}

                  </td>



                  <td className="px-5 py-4 text-sm text-[#555D58]">

                    {manager.email}

                  </td>



               <td className="px-5 py-4 text-sm text-[#555D58]">

  {manager.restaurantName || "Not Assigned"}

</td>



<td className="px-5 py-4 text-sm text-[#555D58]">

  {manager.branchName || "Not Assigned"}

</td>



                  <td className="px-5 py-4">

                    <span

                      className={

                        manager.status === "Active"

                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"

                          : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"

                      }

                    >

                      {manager.status}

                    </span>

                  </td>



<td className="px-5 py-4">

  <div className="relative flex items-center gap-4">



  <a

  href={`/owner/managers/${manager.id}`}

  className="text-sm font-medium text-brand-gold hover:underline"

>

  View

</a>



    <button

      type="button"

      onClick={(event) => {

        event.stopPropagation();



        setOpenMenuId(

          openMenuId === manager.id ? null : manager.id

        );

      }}

      className="text-xl text-muted-foreground hover:text-foreground"

    >

      ⋮

    </button>



    {openMenuId === manager.id && (

   <div className="absolute left-[calc(100%-110px)] top-1/2 z-50 w-32 -translate-y-1/2 rounded-lg border bg-card p-1 shadow-premium">



        <button

          type="button"

       onClick={() => {

  handleEditManager(manager);

}}

          className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"

        >

          Edit

        </button>



   <button

  type="button"

  onClick={() => {

    setDeletingManagerId(manager.id);

    setOpenMenuId(null);

  }}

  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"

>

  Delete

</button>



      </div>

    )}



  </div>

</td>



                </tr>

              ))

            )}

          </tbody>

        </table>
        </div>

      </div>



      {/* Add Manager Modal */}

      {isModalOpen && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10231D]/55 p-4 backdrop-blur-sm">

    <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E9DED0] bg-white shadow-2xl">

            {/* Modal Header */}

          <div className="flex items-start justify-between border-b border-[#EFE6DC] bg-[#FCFAF7] px-7 py-5">

              <div>

             <h2 className="text-2xl font-bold tracking-tight text-[#17211D]">

  {editingManagerId ? "Edit Manager" : "Add Manager"}

</h2>



           <p className="mt-1 text-sm text-muted-foreground">

  {editingManagerId

    ? "Update manager details."

    : "Create a new restaurant manager."}

</p>

              </div>



              <button

                type="button"

                onClick={() => setIsModalOpen(false)}

               className="text-xl text-muted-foreground hover:text-foreground"

              >

                ×

              </button>

            </div>



{/* Form */}



<div className="max-h-[calc(90vh-100px)] overflow-y-auto">

  <div className="px-7 py-6">



    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">



      {/* Personal Information */}

      <div className="md:col-span-2">

        <h3 className="text-lg font-semibold">

          Personal Information

        </h3>



        <p className="mt-1 text-sm text-muted-foreground">

          Basic personal details of the manager.

        </p>

      </div>





{/* Manager Photo */}

<div>

  <label className="text-sm font-medium">

    Passport Size Photo

  </label>



<input

  type="file"

  accept=".jpg,.jpeg,.png"

onChange={(event) => {

  const files = Array.from(event.target.files);



  if (!files.length) return;



  if (files.length > 1) {

    alert("Please select only one profile photo.");

    event.target.value = "";

    return;

  }



  const file = files[0];

  const maxSize = 5 * 1024 * 1024;



  if (file.size > maxSize) {

    alert(`${file.name} must be less than 5 MB.`);

    event.target.value = "";

    return;

  }



  setManagerPhoto(file);

}}

  className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm"

/>



  <p className="mt-1 text-xs text-muted-foreground">

    JPG, JPEG or PNG • Max 2 MB

  </p>

</div>



              {/* Manager Name */}

              <div>

                <label className="text-sm font-medium">

                  Manager Name

                </label>



                <input

                  type="text"

                  placeholder="Enter manager name"

                  value={managerForm.name}

                  onChange={(event) =>

                    setManagerForm({

                      ...managerForm,

                      name: event.target.value,

                    })

                  }

                className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"

                />

              </div>



              {/* Phone */}

              <div>

                <label className="text-sm font-medium">

                  Phone

                </label>



                <input

                  type="tel"

                  placeholder="Enter phone number"

                  value={managerForm.phone}

                  onChange={(event) =>

                    setManagerForm({

                      ...managerForm,

                      phone: event.target.value,

                    })

                  }

                className="mt-2 h-12 w-full rounded-lg border bg-background px-4 outline-none focus:ring-2 focus:ring-brand-gold"

                />

              </div>



              {/* Email */}

              <div>

                <label className="text-sm font-medium">

                  Email

                </label>



<input

  type="email"

  placeholder="Enter email address"

  value={managerForm.email}

  onChange={(event) => {

    const email = event.target.value;



    setManagerForm({

      ...managerForm,

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



              {/* Password */}



{/* Password */}

<div>

  <label className="text-sm font-medium">

    Password

  </label>



  <div className="relative mt-2">

    <input

      type={showPassword ? "text" : "password"}

      placeholder="Enter password"

      value={managerForm.password || ""}

      onChange={(event) =>

        setManagerForm({

          ...managerForm,

          password: event.target.value,

        })

      }

      className="w-full rounded-lg border bg-background px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-brand-gold"

    />



    <button

      type="button"

      onClick={() => setShowPassword(!showPassword)}

      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"

      aria-label={showPassword ? "Hide password" : "Show password"}

    >

      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}

    </button>

  </div>

</div>









{/* Confirm Password */}

<div>

  <label className="text-sm font-medium">

    Confirm Password

  </label>



  <div className="relative mt-2">

    <input

      type={showConfirmPassword ? "text" : "password"}

      placeholder="Confirm password"

      value={managerForm.confirmPassword || ""}

      onChange={(event) =>

        setManagerForm({

          ...managerForm,

          confirmPassword: event.target.value,

        })

      }

      className="w-full rounded-lg border bg-background px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-brand-gold"

    />



    <button

      type="button"

      onClick={() =>

        setShowConfirmPassword(!showConfirmPassword)

      }

      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"

      aria-label={

        showConfirmPassword

          ? "Hide confirm password"

          : "Show confirm password"

      }

    >

      {showConfirmPassword ? (

        <EyeOff size={18} />

      ) : (

        <Eye size={18} />

      )}

    </button>

  </div>

</div>





              {/* Date of Birth */}

<div>

  <label className="text-sm font-medium">

    Date of Birth

  </label>



  <input

    type="date"

    value={managerForm.dateOfBirth}

    onChange={(event) =>

      setManagerForm({

        ...managerForm,

        dateOfBirth: event.target.value,

      })

    }

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

  />

</div>



{/* Marital Status */}

<div>

  <label className="text-sm font-medium">

    Marital Status

  </label>



  <select

    value={managerForm.maritalStatus}

    onChange={(event) =>

      setManagerForm({

        ...managerForm,

        maritalStatus: event.target.value,

      })

    }

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

  >

    <option value="" disabled>

      Select marital status

    </option>



    <option value="Single">

      Single

    </option>



    <option value="Married">

      Married

    </option>



    <option value="Other">

      Other

    </option>

  </select>

</div>





{/* Permanent Address */}

<div className="md:col-span-2">

  <label className="text-sm font-medium">

    Permanent Address

  </label>



  <textarea

    rows="3"

    placeholder="Enter permanent address"

    value={managerForm.permanentAddress}

    onChange={(event) =>

      setManagerForm({

        ...managerForm,

        permanentAddress: event.target.value,

      })

    }

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

  />

</div>



{/* Correspondence Address */}

<div className="md:col-span-2">

  <label className="text-sm font-medium">

    Correspondence Address

  </label>



  <textarea

    rows="3"

    placeholder="Enter correspondence address"

    value={managerForm.correspondenceAddress}

    onChange={(event) =>

      setManagerForm({

        ...managerForm,

        correspondenceAddress: event.target.value,

      })

    }

    className="mt-2 w-full resize-none rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

  />

</div>







{/* Professional Information */}

<div className="md:col-span-2 mt-4">

  <h3 className="text-lg font-semibold">

    Professional Information

  </h3>



  <p className="mt-1 text-sm text-muted-foreground">

    Professional and employment details of the manager.

  </p>

</div>







{/* Qualification */}

<div>

  <label className="text-sm font-medium">

    Qualification

  </label>



  <select

    value={managerForm.qualification}

    onChange={(event) =>

      setManagerForm({

        ...managerForm,

        qualification: event.target.value,

        otherQualification:

          event.target.value === "Other"

            ? managerForm.otherQualification

            : "",

      })

    }

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

  >

    <option value="" disabled>

      Select qualification

    </option>



    <option value="10th">10th</option>

    <option value="12th">12th</option>

    <option value="Diploma">Diploma</option>

    <option value="Graduate">Graduate</option>

    <option value="Post Graduate">Post Graduate</option>

    <option value="B.Tech / BE">B.Tech / BE</option>

    <option value="MBA">MBA</option>

    <option value="MCA">MCA</option>

    <option value="Hotel Management">Hotel Management</option>

    <option value="Other">Other</option>

  </select>



  {/* Other Qualification */}

  {managerForm.qualification === "Other" && (

    <input

      type="text"

      placeholder="Enter course / qualification name"

      value={managerForm.otherQualification}

      onChange={(event) =>

        setManagerForm({

          ...managerForm,

          otherQualification: event.target.value,

        })

      }

      className="mt-3 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

    />

  )}

</div>





{/* Work Experience */}

<div>

  <label className="text-sm font-medium">

    Work Experience

  </label>



  <input

    type="text"

    placeholder="e.g. 5 years"

    value={managerForm.workExperience}

    onChange={(event) =>

      setManagerForm({

        ...managerForm,

        workExperience: event.target.value,

      })

    }

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

  />

</div>



{/* Upload Documents */}

<div className="md:col-span-2 mt-4">

  <h3 className="text-lg font-semibold">

    Upload Documents

  </h3>



</div>







{/* Aadhaar Card */}



<div>

  <label className="text-sm font-medium">

    Aadhaar Card

  </label>



  <input

    type="file"

    accept=".pdf,.jpg,.jpeg,.png"

    multiple

    onChange={(event) => {

      const files = Array.from(event.target.files);



      if (!files.length) return;



      if (files.length > 3) {

        alert("You can upload maximum 3 Aadhaar files.");

        event.target.value = "";

        return;

      }



      const maxSize = 5 * 1024 * 1024;



      const invalidFile = files.find(

        (file) => file.size > maxSize

      );



      if (invalidFile) {

        alert(`${invalidFile.name} must be less than 5 MB.`);

        event.target.value = "";

        return;

      }



      setManagerAadhaar(files);

    }}

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm"

  />



  <p className="mt-1 text-xs text-muted-foreground">

    PDF, JPG or PNG • Maximum 3 files • Max 5 MB per file

  </p>

</div>



{/* PAN Card */}



<div>

  <label className="text-sm font-medium">

    PAN Card

  </label>



  <input

    type="file"

    accept=".pdf,.jpg,.jpeg,.png"

    multiple

    onChange={(event) => {

      const files = Array.from(event.target.files);



      if (!files.length) return;



      if (files.length > 3) {

        alert("You can upload maximum 3 PAN files.");

        event.target.value = "";

        return;

      }



      const maxSize = 5 * 1024 * 1024;



      const invalidFile = files.find(

        (file) => file.size > maxSize

      );



      if (invalidFile) {

        alert(`${invalidFile.name} must be less than 5 MB.`);

        event.target.value = "";

        return;

      }



      setManagerPan(files);

    }}

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm"

  />



  {managerPan.length > 0 && (

    <div className="mt-3 space-y-2">

      {managerPan.map((file, index) => (

        <div

          key={index}

          className="flex items-center justify-between rounded-lg border p-3"

        >

          <div className="flex items-center gap-3">

            <button

              type="button"

              onClick={() => {

                setManagerPan(

                  managerPan.filter(

                    (_, fileIndex) => fileIndex !== index

                  )

                );

              }}

              className="flex h-7 w-7 items-center justify-center rounded-full border text-red-500 hover:bg-red-50"

              title="Remove file"

            >

              <X size={16} />

            </button>



            <p className="text-sm font-medium">

              {file.name}

            </p>

          </div>

        </div>

      ))}

    </div>

  )}



  <p className="mt-1 text-xs text-muted-foreground">

    PDF, JPG or PNG • Maximum 3 files • Max 5 MB per file

  </p>

</div>







{/* Education Certificates Upload */}



<div className="md:col-span-2">

  <label className="text-sm font-medium">

    Education Certificates

  </label>



  <input

    type="file"

    accept=".pdf,.jpg,.jpeg,.png"

    multiple

    onChange={(event) => {

      const files = Array.from(event.target.files);



      if (!files.length) return;



      if (files.length > 10) {

        alert("You can upload maximum 10 education certificate files.");

        event.target.value = "";

        return;

      }



      const maxSize = 10 * 1024 * 1024;



      const invalidFile = files.find(

        (file) => file.size > maxSize

      );



      if (invalidFile) {

        alert(`${invalidFile.name} must be less than 10 MB.`);

        event.target.value = "";

        return;

      }



      setManagerEducation(files);

    }}

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm"

  />



  {managerEducation.length > 0 && (

    <div className="mt-3 space-y-2">

      {managerEducation.map((file, index) => (

        <div

          key={index}

          className="flex items-center justify-between rounded-lg border p-3"

        >

          <div className="flex items-center gap-3">

            <button

              type="button"

              onClick={() => {

                setManagerEducation(

                  managerEducation.filter(

                    (_, fileIndex) => fileIndex !== index

                  )

                );

              }}

              className="flex h-7 w-7 items-center justify-center rounded-full border text-red-500 hover:bg-red-50"

              title="Remove file"

            >

              <X size={16} />

            </button>



            <p className="text-sm font-medium">

              {file.name}

            </p>

          </div>

        </div>

      ))}

    </div>

  )}



  <p className="mt-1 text-xs text-muted-foreground">

    PDF, JPG or PNG • Maximum 10 files • Max 10 MB per file

  </p>

</div>





{/* Employment Documents */}

<div className="md:col-span-2 mt-3">

  <h4 className="text-sm font-semibold">

    Employment Documents

  </h4>

</div>



{/* Experience Letter */}



<div>

  <label className="text-sm font-medium">

    Experience Letter

    <span className="ml-1 text-xs text-muted-foreground">

      (Optional)

    </span>

  </label>



  <input

    type="file"

    accept=".pdf,.jpg,.jpeg,.png"

    multiple

    onChange={(event) => {

      const files = Array.from(event.target.files);



      if (!files.length) return;



      if (files.length > 2) {

        alert("You can upload maximum 2 experience letter files.");

        event.target.value = "";

        return;

      }



      const maxSize = 10 * 1024 * 1024;



      const invalidFile = files.find(

        (file) => file.size > maxSize

      );



      if (invalidFile) {

        alert(`${invalidFile.name} must be less than 10 MB.`);

        event.target.value = "";

        return;

      }



      setManagerExperienceLetter(files);

    }}

    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm"

  />



  {managerExperienceLetter.length > 0 && (

    <div className="mt-3 space-y-2">

      {managerExperienceLetter.map((file, index) => (

        <div

          key={index}

          className="flex items-center justify-between rounded-lg border p-3"

        >

          <div className="flex items-center gap-3">

            <button

              type="button"

              onClick={() => {

                setManagerExperienceLetter(

                  managerExperienceLetter.filter(

                    (_, fileIndex) => fileIndex !== index

                  )

                );

              }}

              className="flex h-7 w-7 items-center justify-center rounded-full border text-red-500 hover:bg-red-50"

              title="Remove file"

            >

              <X size={16} />

            </button>



            <p className="text-sm font-medium">

              {file.name}

            </p>

          </div>

        </div>

      ))}

    </div>

  )}



  <p className="mt-1 text-xs text-muted-foreground">

    PDF, JPG or PNG • Maximum 2 files • Max 10 MB per file

  </p>

</div>









              {/* Status */}

              <div>

                <label className="text-sm font-medium">

                  Status

                </label>



                <select

                  value={managerForm.status}

                  onChange={(event) =>

                    setManagerForm({

                      ...managerForm,

                      status: event.target.value,

                    })

                  }

                  className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"

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



            {/* Buttons */}

           <div className="mt-6 flex items-center justify-end gap-3 border-t pt-5">

              <button

                type="button"

                onClick={() => setIsModalOpen(false)}

                className="rounded-lg border px-5 py-2.5 font-medium transition hover:bg-secondary"

              >

                Cancel

              </button>



            <button

  type="button"

  onClick={

    editingManagerId

      ? handleUpdateManager

      : handleCreateManager

  }

  className="rounded-lg bg-brand-gold px-5 py-2.5 font-medium text-brand-espresso transition hover:opacity-90"

>

  {editingManagerId ? "Update Manager" : "Create Manager"}

</button>

            </div>



          </div>

        </div>

</div>

</div>





      )}



{deletingManagerId !== null && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10231D]/55 p-4 backdrop-blur-sm">

    <div className="w-full max-w-md rounded-2xl border border-[#E9DED0] bg-white p-6 shadow-2xl">

      <h2 className="text-xl font-semibold">

        Delete Manager?

      </h2>



     <p className="mt-2 text-sm text-muted-foreground">

  Are you sure you want to delete{" "}

  <span className="font-semibold text-foreground">

    {managerList.find(

      (manager) => manager.id === deletingManagerId

    )?.name}

  </span>

  ?

  <br />

  This manager will be permanently deleted.

</p>



      <div className="mt-6 flex justify-end gap-3">

        <button

          type="button"

          onClick={() => setDeletingManagerId(null)}

          className="rounded-lg border px-4 py-2"

        >

          Cancel

        </button>



        <button

          type="button"

          onClick={handleDeleteManager}

          className="rounded-lg bg-red-600 px-4 py-2 text-white"

        >

          Delete

        </button>

      </div>

    </div>

  </div>

)}



    </main>

    </div>

  );

}