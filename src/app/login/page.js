"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Check, X } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
const searchParams = useSearchParams();
const ownerId = searchParams.get("ownerId");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

useEffect(() => {
  if (!ownerId) return;

  const savedOwners = localStorage.getItem("owners");

  if (!savedOwners) return;

  const ownerList = JSON.parse(savedOwners);

  const selectedOwner = ownerList.find(
    (owner) => String(owner.id) === String(ownerId)
  );

  if (selectedOwner) {
    setEmail(selectedOwner.email);
  }
}, [ownerId]);

  // -----------------------------
  // EMAIL VALIDATION
  // -----------------------------

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // -----------------------------
  // PASSWORD VALIDATION
  // -----------------------------

const passwordRules = {
  minLength: password.length >= 8,
  hasCapital: /[A-Z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/.test(password),
};

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.hasCapital &&
    passwordRules.hasSpecial;

  // -----------------------------
  // LOGIN
  // -----------------------------

const handleLogin = () => {
  setEmailTouched(true);
  setPasswordTouched(true);

  // -----------------------------
  // BASIC VALIDATION
  // -----------------------------

  if (!email.trim()) {
    alert("Please enter your email address.");
    return;
  }

  if (!isEmailValid) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!password.trim()) {
    alert("Please enter your password.");
    return;
  }

if (!isPasswordValid) {
  alert(
    "Password is not valid.\n\n" +
      "Password must contain:\n" +
      "• Minimum 8 characters\n" +
      "• At least 1 capital letter\n" +
      "• At least 1 number\n" +
      "• At least 1 special character"
  );
  return;
}

  // -----------------------------
  // GET OWNERS FROM LOCAL STORAGE
  // -----------------------------

  const savedOwners = localStorage.getItem("owners");

  if (!savedOwners) {
    alert("No owner account found.");
    return;
  }

  const ownerList = JSON.parse(savedOwners);

  // -----------------------------
  // FIND OWNER
  // -----------------------------

const owner = ownerList.find(
  (item) =>
    item.email.toLowerCase() === email.trim().toLowerCase() &&
    item.password === password &&
    (!ownerId || String(item.id) === String(ownerId))
);

  // -----------------------------
  // INVALID LOGIN
  // -----------------------------

  if (!owner) {
    alert("Invalid email or password.");
    return;
  }

  // -----------------------------
  // SAVE LOGGED-IN OWNER
  // -----------------------------

  localStorage.setItem(
    "loggedInOwnerId",
    String(owner.id)
  );

  // -----------------------------
  // REDIRECT TO OWNER DASHBOARD
  // -----------------------------

  router.push("/owner");
};

  // -----------------------------
  // PASSWORD RULE COMPONENT
  // -----------------------------

  const PasswordRule = ({ valid, children }) => {
    return (
      <div
        className={`flex items-center gap-2 text-sm transition-colors ${
          valid ? "text-green-600" : "text-muted-foreground"
        }`}
      >
        {valid ? (
          <Check size={15} strokeWidth={2.5} />
        ) : (
          <X size={15} />
        )}

        <span>{children}</span>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">

        {/* LOGIN CARD */}
        <div className="rounded-2xl border bg-card p-7 shadow-xl sm:p-9">

          {/* HEADER */}
          <div className="mb-8 text-center">

            {/* LOGO */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold text-brand-espresso shadow-md">
              <Lock size={25} strokeWidth={2} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              RestaurantOS
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Login to your Owner Dashboard
            </p>

          </div>

          {/* FORM */}
          <div className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">
                Email Address
              </label>

              <div className="relative mt-2">

                {/* EMAIL ICON */}
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

       <input
  type="email"
  placeholder="Enter your email"
  value={email}
  readOnly={!!ownerId}
  onChange={(e) => {
    if (!ownerId) {
      setEmail(e.target.value);
    }
  }}
  onBlur={() => setEmailTouched(true)}
  className={`h-12 w-full rounded-lg border bg-background pl-11 pr-4 outline-none transition focus:ring-2 focus:ring-brand-gold ${
    emailTouched && email && !isEmailValid
      ? "border-red-500 focus:ring-red-200"
      : emailTouched && isEmailValid
      ? "border-green-500 focus:ring-green-200"
      : ""
  }`}
/>

              </div>

              {/* EMAIL ERROR */}
              {emailTouched && email && !isEmailValid && (
                <p className="mt-2 text-xs text-red-500">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">
                Password
              </label>

              <div className="relative mt-2">

                {/* LOCK ICON */}
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                {/* PASSWORD INPUT */}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  className={`h-12 w-full rounded-lg border bg-background pl-11 pr-12 outline-none transition focus:ring-2 focus:ring-brand-gold ${
                    passwordTouched && !isPasswordValid
                      ? "border-red-500 focus:ring-red-200"
                      : passwordTouched && isPasswordValid
                      ? "border-green-500 focus:ring-green-200"
                      : ""
                  }`}
                />

                {/* SHOW / HIDE PASSWORD */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {/* PASSWORD RULES */}
              <div className="mt-3 space-y-2 rounded-lg border bg-muted/30 p-3">

                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Password must contain:
                </p>

{/* RULE 1 */}
<PasswordRule valid={passwordRules.minLength}>
  Minimum 8 characters
</PasswordRule>

{/* RULE 2 */}
<PasswordRule valid={passwordRules.hasCapital}>
  At least 1 capital letter
</PasswordRule>

{/* RULE 3 */}
<PasswordRule valid={passwordRules.hasNumber}>
  At least 1 number
</PasswordRule>

{/* RULE 4 */}
<PasswordRule valid={passwordRules.hasSpecial}>
  At least 1 special character
</PasswordRule>

              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="button"
              onClick={handleLogin}
              className="h-12 w-full rounded-lg bg-brand-gold font-semibold text-brand-espresso shadow-sm transition hover:opacity-90 active:scale-[0.99]"
            >
              Login
            </button>

          </div>

          {/* FOOTER */}
          <p className="mt-7 text-center text-xs text-muted-foreground">
            Restaurant Management System
          </p>

        </div>

      </div>
    </main>
  );
}