"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Check,
  X,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [error, setError] = useState("");

  // -----------------------------
  // EMAIL VALIDATION
  // -----------------------------

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // -----------------------------
  // PASSWORD VALIDATION
  // -----------------------------

  const passwordRules = {
    minLength: password.length >= 8,
    hasCapital: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/`~;'+=]/.test(
      password
    ),
  };

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.hasCapital &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecial;

  // -----------------------------
  // LOGIN
  // -----------------------------

  const handleLogin = () => {
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
        "Password must contain minimum 8 characters, 1 capital letter, 1 number and 1 special character."
      );
      return;
    }

    // -----------------------------
    // ADMIN CREDENTIALS
    // -----------------------------

    if (
      email.trim().toLowerCase() ===
        "kapilbaghelabc27@gmail.com" &&
      password === "Kapil@2026"
    ) {
      localStorage.setItem(
        "loggedInAdminId",
        "admin-001"
      );

      router.push("/admin");
      return;
    }

    setError("Invalid email or password.");
  };

  // -----------------------------
  // PASSWORD RULE COMPONENT
  // -----------------------------

  const PasswordRule = ({ valid, children }) => {
    return (
      <div
        className={`flex items-center gap-2 text-sm transition-colors ${
          valid
            ? "text-green-600"
            : "text-muted-foreground"
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
              Login to your Admin Dashboard
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

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onBlur={() => setEmailTouched(true)}
                  className={`h-12 w-full rounded-lg border bg-background pl-11 pr-4 outline-none transition focus:ring-2 focus:ring-brand-gold ${
                    emailTouched &&
                    email &&
                    !isEmailValid
                      ? "border-red-500 focus:ring-red-200"
                      : emailTouched &&
                        isEmailValid
                      ? "border-green-500 focus:ring-green-200"
                      : ""
                  }`}
                />

              </div>

              {emailTouched &&
                email &&
                !isEmailValid && (
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

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onBlur={() =>
                    setPasswordTouched(true)
                  }
                  className={`h-12 w-full rounded-lg border bg-background pl-11 pr-12 outline-none transition focus:ring-2 focus:ring-brand-gold ${
                    passwordTouched &&
                    !isPasswordValid
                      ? "border-red-500 focus:ring-red-200"
                      : passwordTouched &&
                        isPasswordValid
                      ? "border-green-500 focus:ring-green-200"
                      : ""
                  }`}
                />

                {/* SHOW / HIDE PASSWORD */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
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

                <PasswordRule
                  valid={passwordRules.minLength}
                >
                  Minimum 8 characters
                </PasswordRule>

                <PasswordRule
                  valid={passwordRules.hasCapital}
                >
                  At least 1 capital letter
                </PasswordRule>

                <PasswordRule
                  valid={passwordRules.hasNumber}
                >
                  At least 1 number
                </PasswordRule>

                <PasswordRule
                  valid={passwordRules.hasSpecial}
                >
                  At least 1 special character
                </PasswordRule>

              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-xs text-red-500">
                ⚠ {error}
              </p>
            )}

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