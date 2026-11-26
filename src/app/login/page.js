"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Check, X, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("ownerId");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // PRE-FILL OWNER EMAIL WHEN OWNER ID IS PROVIDED
  useEffect(() => {
    if (!ownerId) return;

    try {
      const savedOwners = localStorage.getItem("owners");
      if (!savedOwners) return;

      const ownerList = JSON.parse(savedOwners);
      const selectedOwner = ownerList.find(
        (owner) => String(owner.id) === String(ownerId)
      );

      if (selectedOwner) {
        setEmail(selectedOwner.email || "");
      }
    } catch {
      setError("Unable to read owner account data.");
    }
  }, [ownerId]);

  // EMAIL VALIDATION
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // PASSWORD VALIDATION
  const passwordRules = {
    minLength: password.length >= 8,
    hasCapital: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.hasCapital &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecial;

  // LOGIN: ADMIN OR OWNER

const handleLogin = async () => {
  setEmailTouched(true);
  setPasswordTouched(true);
  setError("");

  if (!email.trim()) {
    setError("Please enter your email address.");
    return;
  }

  if (!isEmailValid) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!password.trim()) {
    setError("Please enter your password.");
    return;
  }

  if (!isPasswordValid) {
    setError(
      "Password must contain at least 8 characters, 1 capital letter, 1 number and 1 special character."
    );
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. ADMIN LOGIN
  if (normalizedEmail === "kapilbaghelabc27@gmail.com") {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("loggedInAdminId", data.admin.id);
      localStorage.removeItem("loggedInOwnerId");

      router.push("/admin");
      return;
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Unable to connect to the server. Please try again.");
      return;
    }
  }

  // 2. OWNER LOGIN
  try {
    const ownerResponse = await fetch("/api/owners/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
    });

    const ownerData = await ownerResponse.json();

    // Owner login successful
    if (ownerResponse.ok && ownerData.success) {
      localStorage.setItem("loggedInOwnerId", ownerData.owner.id);
      localStorage.removeItem("loggedInAdminId");

      router.push("/owner");
      return;
    }

    // Only try Manager login if Owner account was not found
    // or the credentials were rejected.
    if (
      ownerResponse.status !== 401 &&
      ownerResponse.status !== 404
    ) {
      setError(ownerData.message || "Invalid email or password.");
      return;
    }

    // 3. MANAGER LOGIN
    const managerResponse = await fetch("/api/manager/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
    });

    const managerData = await managerResponse.json();

    if (!managerResponse.ok || !managerData.success) {
      setError(
        managerData.message ||
          ownerData.message ||
          "Invalid email or password."
      );
      return;
    }

    localStorage.removeItem("loggedInAdminId");
    localStorage.removeItem("loggedInOwnerId");

    router.push("/manager");
    return;

  } catch (error) {
    console.error("Login error:", error);
    setError("Unable to connect to the server. Please try again.");
  }
};


  // PASSWORD RULE COMPONENT
  const PasswordRule = ({ valid, children }) => (
    <div
      className={`flex items-center gap-2 text-xs transition-colors ${
        valid ? "text-emerald-700" : "text-[#9A9B95]"
      }`}
    >
      {valid ? <Check size={14} strokeWidth={2.5} /> : <X size={14} />}
      <span>{children}</span>
    </div>
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F2EC] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D9B46E]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#173D32]/10 blur-3xl" />

      <div className="relative w-full max-w-[440px]">
        <div className="overflow-hidden rounded-[28px] border border-[#E8E1D6] bg-white shadow-[0_24px_70px_rgba(28,49,40,0.12)]">
          <div className="h-2 w-full bg-[#D9A653]" />

          <div className="px-7 py-9 sm:px-10 sm:py-11">
            {/* HEADER */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#173D32] text-[#E2B65F] shadow-lg shadow-[#173D32]/20">
                <ShieldCheck size={29} strokeWidth={1.8} />
              </div>

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#B18A4A]">
                Restaurant Management
              </p>
              <h1 className="text-[30px] font-bold tracking-tight text-[#173D32]">
                RestaurantOS
              </h1>
              <p className="mt-2 text-sm text-[#85877F]">
                Sign in to access your dashboard
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#34483F]">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A958D]"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    readOnly={!!ownerId}
                    onChange={(event) => {
                      if (!ownerId) setEmail(event.target.value);
                      setError("");
                    }}
                    onBlur={() => setEmailTouched(true)}
                    className={`h-[52px] w-full rounded-xl border bg-[#FBFCFA] pl-11 pr-4 text-sm text-[#20382F] outline-none transition placeholder:text-[#A4AAA4] focus:border-[#B99250] focus:ring-4 focus:ring-[#D9A653]/15 ${
                      emailTouched && email && !isEmailValid
                        ? "border-red-400 focus:ring-red-100"
                        : emailTouched && isEmailValid
                        ? "border-emerald-500"
                        : "border-[#E3E8E2]"
                    }`}
                  />
                </div>

                {emailTouched && email && !isEmailValid && (
                  <p className="mt-2 text-xs text-red-500">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#34483F]">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A958D]"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    className={`h-[52px] w-full rounded-xl border bg-[#FBFCFA] pl-11 pr-12 text-sm text-[#20382F] outline-none transition placeholder:text-[#A4AAA4] focus:border-[#B99250] focus:ring-4 focus:ring-[#D9A653]/15 ${
                      passwordTouched && !isPasswordValid
                        ? "border-red-400 focus:ring-red-100"
                        : passwordTouched && isPasswordValid
                        ? "border-emerald-500"
                        : "border-[#E3E8E2]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#89948C] transition hover:bg-[#EEF2EE] hover:text-[#173D32]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>


              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="button"
                onClick={handleLogin}
                className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#D9A653] text-sm font-bold text-[#173D32] shadow-md shadow-[#D9A653]/20 transition hover:bg-[#C99A45] active:scale-[0.99]"
              >
                Login to Dashboard
              </button>
            </div>

            {/* FOOTER */}
            <div className="mt-8 border-t border-[#EEF0EB] pt-5 text-center">
              <p className="text-[11px] font-medium tracking-wide text-[#92968E]">
                Restaurant Management System
              </p>
              <p className="mt-1 text-[10px] text-[#B0B3AC]">
                Secure access for authorised users
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC] text-sm text-[#6F7D73]">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
