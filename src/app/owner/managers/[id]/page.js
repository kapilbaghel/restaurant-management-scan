"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useParams } from "next/navigation";

export default function ManagerDetails() {
  const params = useParams();

  const [manager, setManager] = useState(null);
const [showAadhaar, setShowAadhaar] = useState(false);
const [aadhaarUrl, setAadhaarUrl] = useState("");

const [showPan, setShowPan] = useState(false);
const [panUrl, setPanUrl] = useState("");

const [showEducation, setShowEducation] = useState(false);
const [educationUrl, setEducationUrl] = useState("");

const [showExperienceLetter, setShowExperienceLetter] = useState(false);
const [experienceLetterUrl, setExperienceLetterUrl] = useState("");


  useEffect(() => {
    const savedManagers = localStorage.getItem("managers");

    if (savedManagers) {
      const managers = JSON.parse(savedManagers);

const foundManager = managers.find(
  (manager) => manager.id === Number(params.id)
);

console.log("AADHAAR DATA:", foundManager?.aadhaar);

setManager(foundManager);
    }
  }, [params.id]);



const handleViewAadhaar = (file) => {
  if (!file || !file.data) {
    return;
  }

  if (file.data.startsWith("data:application/pdf")) {
    const base64Data = file.data.split(",")[1];

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    setAadhaarUrl(url);
    setShowAadhaar(true);

    return;
  }

  setAadhaarUrl(file.data);
  setShowAadhaar(true);
};

const handleViewPan = (file) => {
  if (!file || !file.data) {
    return;
  }

  if (file.data.startsWith("data:application/pdf")) {
    const base64Data = file.data.split(",")[1];

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    setPanUrl(url);
    setShowPan(true);

    return;
  }

  setPanUrl(file.data);
  setShowPan(true);
};

const handleViewEducation = (file) => {
  if (!file || !file.data) {
    return;
  }

  if (file.data.startsWith("data:application/pdf")) {
    const base64Data = file.data.split(",")[1];

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    setEducationUrl(url);
    setShowEducation(true);

    return;
  }

  setEducationUrl(file.data);
  setShowEducation(true);
};


const handleViewExperienceLetter = (file) => {
  if (!file || !file.data) {
    return;
  }

  if (file.data.startsWith("data:application/pdf")) {
    const base64Data = file.data.split(",")[1];

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    setExperienceLetterUrl(url);
    setShowExperienceLetter(true);

    return;
  }

  setExperienceLetterUrl(file.data);
  setShowExperienceLetter(true);
};



const handleRemovePan = (index) => {
  const updatedPan = manager.pan.filter(
    (_, fileIndex) => fileIndex !== index
  );

  const updatedManager = {
    ...manager,
    pan: updatedPan,
  };

  const savedManagers = localStorage.getItem("managers");

  if (savedManagers) {
    const managers = JSON.parse(savedManagers);

    const updatedManagers = managers.map((item) =>
      item.id === manager.id ? updatedManager : item
    );

    localStorage.setItem(
      "managers",
      JSON.stringify(updatedManagers)
    );
  }

  setManager(updatedManager);
};

const handleRemoveAadhaar = (index) => {
  const updatedAadhaar = manager.aadhaar.filter(
    (_, fileIndex) => fileIndex !== index
  );

  const updatedManager = {
    ...manager,
    aadhaar: updatedAadhaar,
  };

  const savedManagers = localStorage.getItem("managers");

  if (savedManagers) {
    const managers = JSON.parse(savedManagers);

    const updatedManagers = managers.map((item) =>
      item.id === manager.id ? updatedManager : item
    );

    localStorage.setItem(
      "managers",
      JSON.stringify(updatedManagers)
    );
  }

  setManager(updatedManager);
};

  

  if (!manager) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">
          Manager Not Found
        </h1>

        <p className="mt-2 text-muted-foreground">
          The manager you are looking for does not exist.
        </p>
      </div>
    );
  }

  

  return (
    <div className="p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold">
          Manager Details
        </h1>

        <p className="mt-2 text-muted-foreground">
          Complete information about the restaurant manager.
        </p>
      </div>

      {/* Manager Details Card */}
      <div className="mt-8 rounded-xl border bg-card p-6 shadow-premium">

        {/* Manager Photo */}
<div className="mb-8 flex justify-center">
  {manager.photo && (
    <img
      src={manager.photo}
      alt={manager.name || "Manager"}
      className="h-32 w-32 rounded-full object-cover border"
    />
  )}
</div>
        
        {/* Personal Information */}
        <h2 className="text-xl font-semibold">
          Personal Information
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          {/* Name */}
          <div>
            <p className="text-sm text-muted-foreground">
              Manager Name
            </p>

            <p className="mt-1 font-medium">
              {manager.name || "Not provided"}
            </p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm text-muted-foreground">
              Phone
            </p>

            <p className="mt-1 font-medium">
              {manager.phone || "Not provided"}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <p className="mt-1 font-medium">
              {manager.email || "Not provided"}
            </p>
          </div>

          {/* Date of Birth */}
          <div>
            <p className="text-sm text-muted-foreground">
              Date of Birth
            </p>

            <p className="mt-1 font-medium">
              {manager.dateOfBirth || "Not provided"}
            </p>
          </div>

          {/* Marital Status */}
          <div>
            <p className="text-sm text-muted-foreground">
              Marital Status
            </p>

            <p className="mt-1 font-medium">
              {manager.maritalStatus || "Not provided"}
            </p>
          </div>

        </div>

        {/* Address Information */}
        <div className="mt-8 border-t pt-6">

          <h2 className="text-xl font-semibold">
            Address Information
          </h2>

          <div className="mt-5 grid gap-6 md:grid-cols-2">

            {/* Permanent Address */}
            <div>
              <p className="text-sm text-muted-foreground">
                Permanent Address
              </p>

              <p className="mt-1 whitespace-pre-line font-medium">
                {manager.permanentAddress || "Not provided"}
              </p>
            </div>

            {/* Correspondence Address */}
            <div>
              <p className="text-sm text-muted-foreground">
                Correspondence Address
              </p>

              <p className="mt-1 whitespace-pre-line font-medium">
                {manager.correspondenceAddress || "Not provided"}
              </p>
            </div>

          </div>
        </div>

        {/* Professional Information */}
        <div className="mt-8 border-t pt-6">

          <h2 className="text-xl font-semibold">
            Professional Information
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {/* Qualification */}
            <div>
              <p className="text-sm text-muted-foreground">
                Qualification
              </p>

              <p className="mt-1 font-medium">
                {manager.qualification === "Other"
                  ? manager.otherQualification || "Not provided"
                  : manager.qualification || "Not provided"}
              </p>
            </div>

            {/* Work Experience */}
            <div>
              <p className="text-sm text-muted-foreground">
                Work Experience
              </p>

              <p className="mt-1 font-medium">
                {manager.workExperience || "Not provided"}
              </p>
            </div>

            {/* Restaurant */}
            <div>
              <p className="text-sm text-muted-foreground">
                Restaurant
              </p>

              <p className="mt-1 font-medium">
                {manager.restaurant || "Not provided"}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-muted-foreground">
                Status
              </p>

              <span
                className={
                  manager.status === "Active"
                    ? "mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                    : "mt-1 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                }
              >
                {manager.status || "Not provided"}
              </span>
            </div>

          </div>
        </div>


        {/* Documents */}
        <div className="mt-8 border-t pt-6">

          <h2 className="text-xl font-semibold">
            Documents
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {/* Aadhaar Card */}
<div>
  <p className="text-sm text-muted-foreground">
    Aadhaar Card
  </p>

  {Array.isArray(manager.aadhaar) && manager.aadhaar.length > 0 ? (
    <div className="mt-2 space-y-3">


{manager.aadhaar.map((file, index) => (
  <div
    key={index}
    className="flex items-center justify-between rounded-lg border p-3"
  >
    <div className="flex items-center gap-3">

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => handleRemoveAadhaar(index)}
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

    {/* View Button */}
    <button
      type="button"
      onClick={() => handleViewAadhaar(file)}
      className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-espresso hover:opacity-90"
    >
      View Aadhaar
    </button>

  </div>
))}


    </div>
  ) : (
    <p className="mt-1 font-medium text-gray-400">
      Not uploaded
    </p>
  )}
</div>


{/* PAN Card */}
<div className="mt-5">
  <p className="text-sm text-muted-foreground">
    PAN Card
  </p>

  {Array.isArray(manager.pan) && manager.pan.length > 0 ? (
    <div className="mt-2 space-y-3">
      {manager.pan.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">

            {/* Remove PAN */}
            <button
              type="button"
              onClick={() => handleRemovePan(index)}
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

          {/* View PAN */}
          <button
            type="button"
            onClick={() => handleViewPan(file)}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-espresso hover:opacity-90"
          >
            View PAN
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-1 font-medium text-gray-400">
      Not uploaded
    </p>
  )}
</div>

{/* Education Certificates */}
<div className="mt-5">
  <p className="text-sm text-muted-foreground">
    Education Certificates
  </p>

  {Array.isArray(manager.educationCertificates) &&
  manager.educationCertificates.length > 0 ? (
    <div className="mt-2 space-y-3">
      {manager.educationCertificates.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">

            {/* Remove Certificate */}
            {/* <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full border text-red-500 hover:bg-red-50"
              title="Remove file"
            >
              <X size={16} />
            </button> */}

            {/* File Name */}
            <p className="text-sm font-medium">
              {file.name}
            </p>

          </div>

          {/* View Certificate */}
          <button
            type="button"
            onClick={() => handleViewEducation(file)}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-espresso hover:opacity-90"
          >
            View Certificate
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-1 font-medium text-gray-400">
      Not uploaded
    </p>
  )}
</div>

{/* Experience Letters */}
<div className="mt-5">
  <p className="text-sm text-muted-foreground">
    Experience Letters
  </p>

  {Array.isArray(manager.experienceLetters) &&
  manager.experienceLetters.length > 0 ? (
    <div className="mt-2 space-y-3">
      {manager.experienceLetters.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <p className="text-sm font-medium">
            {file.name}
          </p>

          <button
            type="button"
            onClick={() => handleViewExperienceLetter(file)}
            className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-espresso hover:opacity-90"
          >
            View Experience Letter
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-1 font-medium text-gray-400">
      Not uploaded
    </p>
  )}
</div>

          </div>
        </div>


      </div>

      {showAadhaar && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
    
    <div className="relative h-[90vh] w-full max-w-5xl rounded-xl bg-white shadow-xl">

      <button
        type="button"
        onClick={() => {
          setShowAadhaar(false);
          setAadhaarUrl("");
        }}
        className="absolute right-4 top-4 z-10 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Close
      </button>

      <div className="h-full w-full p-4 pt-16">
        <iframe
          src={aadhaarUrl}
          title="Aadhaar Card"
          className="h-full w-full rounded-lg border"
        />
      </div>

    </div>
  </div>
)}

{showPan && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
    
    <div className="relative h-[90vh] w-full max-w-5xl rounded-xl bg-white shadow-xl">

      <button
        type="button"
        onClick={() => {
          setShowPan(false);
          setPanUrl("");
        }}
        className="absolute right-4 top-4 z-10 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Close
      </button>

      <div className="h-full w-full p-4 pt-16">
        <iframe
          src={panUrl}
          title="PAN Card"
          className="h-full w-full rounded-lg border"
        />
      </div>

    </div>
  </div>
)}

{showEducation && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

    <div className="relative h-[90vh] w-full max-w-5xl rounded-xl bg-white shadow-xl">

      <button
        type="button"
        onClick={() => {
          setShowEducation(false);
          setEducationUrl("");
        }}
        className="absolute right-4 top-4 z-10 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Close
      </button>

      <div className="h-full w-full p-4 pt-16">
        <iframe
          src={educationUrl}
          title="Education Certificate"
          className="h-full w-full rounded-lg border"
        />
      </div>

    </div>

  </div>

  
)}

{showExperienceLetter && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

    <div className="relative h-[90vh] w-full max-w-5xl rounded-xl bg-white shadow-xl">

      <button
        type="button"
        onClick={() => {
          setShowExperienceLetter(false);
          setExperienceLetterUrl("");
        }}
        className="absolute right-4 top-4 z-10 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Close
      </button>

      <div className="h-full w-full p-4 pt-16">
        <iframe
          src={experienceLetterUrl}
          title="Experience Letter"
          className="h-full w-full rounded-lg border"
        />
      </div>

    </div>

  </div>
)}


    </div>
  );
}