"use client";

import { useContext, useEffect, useState } from "react";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import { X } from "lucide-react";


export default function ManagersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [managerList, setManagerList] = useState([]);

const [restaurantList, setRestaurantList] = useState([]);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [editingManagerId, setEditingManagerId] = useState(null);

  const [deletingManagerId, setDeletingManagerId] = useState(null);

  const [currentOwnerId, setCurrentOwnerId] = useState(null);

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


const handleEditManager = (manager) => {
  setEditingManagerId(manager.id);

setManagerForm({
  name: manager.name || "",
  phone: manager.phone || "",

  email: manager.email || "",

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



const handleUpdateManager = () => {

    console.log("AADHAAR BEFORE UPDATE:", managerAadhaar);
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
};




  // Create Manager
  const handleCreateManager = () => {
    // Required fields check
    if (
      !managerForm.name ||
      !managerForm.phone ||
      !managerForm.email 
      // !managerForm.restaurant
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const emailValidationError = validateEmail(managerForm.email);

if (emailValidationError) {
  setEmailError(emailValidationError);
  return;
}

const newManager = {
  id: Date.now(),

  name: managerForm.name,
  phone: managerForm.phone,
  email: managerForm.email,

  password: managerForm.password,

  ownerId: Number(localStorage.getItem("loggedInOwnerId")),
  

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
};

    // Get old managers
    const savedManagers = localStorage.getItem("managers");

    const managers = savedManagers
      ? JSON.parse(savedManagers)
      : [];

    // Add new manager to old managers
    const updatedManagers = [
      ...managers,
      newManager,
    ];

    // Update React state
    setManagerList(updatedManagers);

    // Save to Local Storage
    localStorage.setItem(
      "managers",
      JSON.stringify(updatedManagers)
    );

    console.log("Manager saved:", newManager);

    // Close modal
    setIsModalOpen(false);

    // Reset form
   setManagerForm({
  name: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  maritalStatus: "",
  qualification: "",
  otherQualification: "",
  workExperience: "",
  // restaurant: "",
  status: "Active",
});
setEmailError("");

  };
return (
  <div className="flex min-h-screen">
    <OwnerSidebar />

    <main className="ml-64 flex-1 p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            Managers
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage all restaurant managers from here.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
  setEmailError("");
  setIsModalOpen(true);
}}
          className="rounded-lg bg-brand-gold px-5 py-3 font-medium text-brand-espresso transition hover:opacity-90"
        >
          + Add Manager
        </button>
      </div>

      {/* Managers Table */}
      <div className="mt-8 overflow-visible rounded-xl border bg-card shadow-premium">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/40">

              <th className="px-5 py-4 text-left text-sm font-semibold">
      S.No.
    </th>
              <th className="px-5 py-4 text-left text-sm font-semibold">
                Manager
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Phone
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Email
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Restaurant
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
              Actions
              </th>

            </tr>
          </thead>

          <tbody>
            {managerList.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No managers found.
                </td>
              </tr>
            ) : (
              managerList.map((manager,index) => (
                <tr
                  key={manager.id}
                  className="border-b last:border-b-0 hover:bg-secondary/40"
                >

                  <td className="px-5 py-4 text-sm">
                  {index + 1}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {manager.name}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {manager.phone}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {manager.email}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {manager.restaurant}
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

      {/* Add Manager Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-card shadow-xl">
            {/* Modal Header */}
          <div className="flex items-start justify-between border-b px-7 py-5">
              <div>
             <h2 className="text-2xl font-semibold">
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
    multiple
  onChange={(event) => {
  const files = Array.from(event.target.files);

  if (!files.length) return;

  // Maximum 3 files
  if (files.length > 3) {
    alert("You can upload maximum 3 PAN files.");
    event.target.value = "";
    return;
  }

  // Maximum 5 MB per file
  const maxSize = 5 * 1024 * 1024;

  const invalidFile = files.find(
    (file) => file.size > maxSize
  );

  if (invalidFile) {
    alert(`${invalidFile.name} must be less than 5 MB.`);
    event.target.value = "";
    return;
  }

  // Convert files into Base64
  const fileReaders = files.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve({
          name: file.name,
          data: reader.result,
        });
      };

      reader.onerror = () => {
        reject(new Error("File could not be read."));
      };

      reader.readAsDataURL(file);
    });
  });

  Promise.all(fileReaders)
    .then((results) => {
      setManagerPan(results);
    })
    .catch(() => {
      alert("Something went wrong while reading the PAN files.");
    });
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
<div>
  <label className="text-sm font-medium">
    Password
  </label>

  <input
    type="password"
    placeholder="Enter password"
    value={managerForm.password}
    onChange={(event) =>
      setManagerForm({
        ...managerForm,
        password: event.target.value,
      })
    }
   className="mt-2 w-full resize-none rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"
  />
</div>

{/* Confirm Password */}
<div>
  <label className="text-sm font-medium">
    Confirm Password
  </label>

  <input
    type="password"
    placeholder="Confirm password"
    value={managerForm.confirmPassword}
    onChange={(event) =>
      setManagerForm({
        ...managerForm,
        confirmPassword: event.target.value,
      })
    }
    className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"
  />
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

      // Maximum 3 files
      if (files.length > 3) {
        alert("You can upload maximum 3 Aadhaar files.");
        event.target.value = "";
        return;
      }

      // Maximum 5 MB per file
      const maxSize = 5 * 1024 * 1024;

      const invalidFile = files.find(
        (file) => file.size > maxSize
      );

      if (invalidFile) {
        alert(
          `${invalidFile.name} must be less than 5 MB.`
        );
        event.target.value = "";
        return;
      }

      // Convert all files to Base64
      const fileReaders = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

       reader.onload = () => {
  resolve({
    name: file.name,
    data: reader.result,
  });
};

          reader.onerror = () => {
            reject(new Error("File could not be read."));
          };

          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders)
        .then((results) => {
          setManagerAadhaar(results);
        })
        .catch(() => {
          alert("Something went wrong while reading the files.");
        });
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

    // Maximum 3 files
    if (files.length > 3) {
      alert("You can upload maximum 3 PAN files.");
      event.target.value = "";
      return;
    }

    // Maximum 5 MB per file
    const maxSize = 5 * 1024 * 1024;

    const invalidFile = files.find(
      (file) => file.size > maxSize
    );

    if (invalidFile) {
      alert(`${invalidFile.name} must be less than 5 MB.`);
      event.target.value = "";
      return;
    }

    // Convert files into Base64
    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve({
            name: file.name,
            data: reader.result,
          });
        };

        reader.onerror = () => {
          reject(new Error("File could not be read."));
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((results) => {
        setManagerPan(results);
      })
      .catch(() => {
        alert("Something went wrong while reading the PAN files.");
      });
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

          {/* Remove Button */}
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

          {/* File Name */}
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

    // Maximum 10 files
    if (files.length > 10) {
      alert("You can upload maximum 10 education certificate files.");
      event.target.value = "";
      return;
    }

    // Maximum 10 MB per file
    const maxSize = 10 * 1024 * 1024;

    const invalidFile = files.find(
      (file) => file.size > maxSize
    );

    if (invalidFile) {
      alert(`${invalidFile.name} must be less than 10 MB.`);
      event.target.value = "";
      return;
    }

    // Convert files into Base64
    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve({
            name: file.name,
            data: reader.result,
          });
        };

        reader.onerror = () => {
          reject(new Error("File could not be read."));
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((results) => {
        setManagerEducation(results);
      })
      .catch(() => {
        alert(
          "Something went wrong while reading the education certificates."
        );
      });
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

          {/* Remove Certificate */}
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

          {/* File Name */}
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

    // Maximum 2 files
    if (files.length > 2) {
      alert("You can upload maximum 2 experience letter files.");
      event.target.value = "";
      return;
    }

    // Maximum 10 MB per file
    const maxSize = 10 * 1024 * 1024;

    const invalidFile = files.find(
      (file) => file.size > maxSize
    );

    if (invalidFile) {
      alert(`${invalidFile.name} must be less than 10 MB.`);
      event.target.value = "";
      return;
    }

    // Convert files into Base64
    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve({
            name: file.name,
            data: reader.result,
          });
        };

        reader.onerror = () => {
          reject(new Error("File could not be read."));
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((results) => {
        setManagerExperienceLetter(results);
      })
      .catch(() => {
        alert(
          "Something went wrong while reading the experience letters."
        );
      });
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

          {/* Remove Experience Letter */}
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

          {/* File Name */}
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-premium">
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