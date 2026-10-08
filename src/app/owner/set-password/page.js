"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function SetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

 const passwordRules = {
  minLength: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /\d/.test(password),
special: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/.test(password),
};

const isPasswordValid =
  passwordRules.minLength &&
  passwordRules.uppercase &&
  passwordRules.number &&
  passwordRules.special;

const handleSetPassword = (event) => {
  event.preventDefault();

  if (!email) {
    alert("Owner email is missing.");
    return;
  }

  // 1. Check minimum 8 characters
  if (password.length < 8) {
    alert("Your password must contain at least 8 characters.");
    return;
  }

  // 2. Check capital letter
  if (!/[A-Z]/.test(password)) {
    alert("Your password must contain at least 1 capital letter.");
    return;
  }

  // 3. Check number
  if (!/\d/.test(password)) {
    alert("Your password must contain at least 1 number.");
    return;
  }

  // 4. Check special character
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/.test(password)) {
    alert(
      "Your password must contain at least 1 special character."
    );
    return;
  }

  // 5. Check confirm password
  if (password !== confirmPassword) {
    alert("Your passwords do not match.");
    return;
  }

  // GET EXISTING OWNERS
  const savedOwners = localStorage.getItem("owners");

  if (!savedOwners) {
    alert("Owner account not found.");
    return;
  }

  const ownerList = JSON.parse(savedOwners);

  // FIND OWNER BY EMAIL
  const ownerIndex = ownerList.findIndex(
    (owner) =>
      owner.email.toLowerCase() === email.toLowerCase()
  );

  if (ownerIndex === -1) {
    alert("No owner account found with this email.");
    return;
  }

  // UPDATE OWNER PASSWORD
  const updatedOwners = ownerList.map((owner, index) => {
    if (index === ownerIndex) {
      return {
        ...owner,
        password: password,
      };
    }

    return owner;
  });

  // SAVE UPDATED OWNERS
  localStorage.setItem(
    "owners",
    JSON.stringify(updatedOwners)
  );

  alert("Password set successfully!");

  // CLEAR PASSWORD FIELDS
  setPassword("");
  setConfirmPassword("");
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-premium">

        {/* Heading */}
        <h1 className="text-2xl font-semibold">
          Set Your Password
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new password for your RestaurantOS owner account.
        </p>

        <form
          onSubmit={handleSetPassword}
          className="mt-6 space-y-5"
        >

          {/* Owner Email */}
          <div>
            <label className="text-sm font-medium">
              Owner Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              className="mt-2 w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              This email will be used for your RestaurantOS owner account.
            </p>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium">
              New Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter new password"
                className="w-full rounded-lg border bg-background px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-brand-gold"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
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
        missingConditions.push("at least 1 capital letter");
      }

      if (!passwordRules.number) {
        missingConditions.push("at least 1 number");
      }

      if (!passwordRules.special) {
        missingConditions.push("at least 1 special character");
      }

      if (!passwordRules.minLength) {
        missingConditions.push(
          "your password should be minimum 8 characters"
        );
      }

      if (missingConditions.length === 1) {
        const condition = missingConditions[0];

        if (condition.startsWith("your")) {
          return `Your ${condition}.`;
        }

        return `Your password must contain ${condition}.`;
      }

      const lastCondition =
        missingConditions[missingConditions.length - 1];

      const otherConditions =
        missingConditions.slice(0, -1);

      return `Your password must contain ${otherConditions.join(
        ", "
      )} and ${lastCondition}.`;
    })()}
  </p>
)}



          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">
              Confirm Password
            </label>

            <div className="relative mt-2">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
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
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Password Match */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={
              !email ||
              !isPasswordValid ||
              password !== confirmPassword
            }
            className="w-full rounded-lg bg-brand-gold px-5 py-3 font-medium text-brand-espresso transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Set Password
          </button>

        </form>
      </div>
    </main>
  );
}

/* =========================
   PASSWORD RULE COMPONENT
========================= */

function PasswordRule({ valid, text }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        valid
          ? "text-green-600"
          : "text-muted-foreground"
      }`}
    >
      {valid ? (
        <Check size={16} />
      ) : (
        <X size={16} />
      )}

      <span>{text}</span>
    </div>
  );
}