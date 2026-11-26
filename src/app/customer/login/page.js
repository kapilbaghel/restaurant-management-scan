
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSendOtp(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/public/customers/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            name: name.trim(),
            mobile: mobile.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send OTP.");
      }

      setOtpSent(true);
      setMessage(data.message || "OTP sent successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/public/customers/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed.");
      }

      setMessage("Login successful!");

      // Allow only internal application paths
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");

      const safeReturnTo =
        returnTo &&
        returnTo.startsWith("/") &&
        !returnTo.startsWith("//") &&
        !returnTo.includes("\\")
          ? returnTo
          : "/";

      router.replace(safeReturnTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-7 sm:p-9">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Login or create your customer account
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>

              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Continue with Email"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              New customers should enter their name and mobile number.
              Existing customers can continue using their registered email.
            </p>

          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">

            <div className="text-center">
              <p className="text-sm text-gray-600">
                We have sent a verification code to
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                {email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter 6-digit OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter OTP"
                maxLength={6}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center tracking-[8px] text-xl outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP & Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-sm text-gray-600 hover:text-black"
            >
              Change Email / Details
            </button>

          </form>
        )}

      </div>
    </main>
  );
}
