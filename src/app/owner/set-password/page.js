
"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function SetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  const passwordRules = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.number &&
    passwordRules.special;

  const handleSetPassword = async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Invitation link is missing or invalid.");
      return;
    }

    if (!isPasswordValid) {
      alert(
        "Password must contain at least 8 characters, one capital letter, one number and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/owners/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to set password.");
        return;
      }

      alert("Password set successfully! You can now log in.");

      window.location.href = "/login";
    } catch (error) {
      console.error("Set password error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-premium">

        <h1 className="text-2xl font-semibold">
          Set Your Password
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new password for your RestaurantOS owner account.
        </p>

        {!token ? (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            Invitation link is missing. Please open the password setup
            link received in your email.
          </div>
        ) : (
          <form
            onSubmit={handleSetPassword}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="text-sm font-medium">
                New Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border bg-background px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-brand-gold"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {password && !isPasswordValid && (
              <p className="text-sm leading-5 text-red-600">
                {(() => {
                  const missingConditions = [];

                  if (!passwordRules.uppercase) {
                    missingConditions.push("one capital letter");
                  }

                  if (!passwordRules.number) {
                    missingConditions.push("one number");
                  }

                  if (!passwordRules.special) {
                    missingConditions.push("one special character");
                  }

                  if (!passwordRules.minLength) {
                    missingConditions.push("at least 8 characters");
                  }

                  return `Your password must contain ${missingConditions.join(", ")}.`;
                })()}
              </p>
            )}

            <div>
              <label className="text-sm font-medium">
                Confirm Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border bg-background px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-brand-gold"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {confirmPassword && (
                <div className="mt-2">
                  {password === confirmPassword ? (
                    <p className="flex items-center gap-2 text-sm text-green-600">
                      <Check size={16} />
                      Passwords match
                    </p>
                  ) : (
                    <p className="flex items-center gap-2 text-sm text-red-600">
                      <X size={16} />
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={
                !isPasswordValid ||
                password !== confirmPassword ||
                loading
              }
              className="w-full rounded-lg bg-brand-gold px-5 py-3 font-medium text-brand-espresso transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
