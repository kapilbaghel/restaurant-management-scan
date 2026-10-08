"use client";

export default function TestEmailPage() {
  const sendTestEmail = async () => {
    try {
      const response = await fetch("/api/send-owner-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerName: "Test Owner",
          ownerEmail: "kapilbaghelabc27@gmail.com",
          restaurantName: "Test Restaurant",
        }),
      });

      const result = await response.json();

      console.log(result);

      if (result.success) {
        alert("Email sent successfully!");
      } else {
        alert(result.message || "Email failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={sendTestEmail}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Send Test Email
      </button>
    </main>
  );
}