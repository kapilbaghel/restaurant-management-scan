"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const loggedInOwnerId = localStorage.getItem("loggedInOwnerId");

    if (!loggedInOwnerId) {
      router.replace("/login");
    }
  }, [router]);

  const loggedInOwnerId =
    typeof window !== "undefined"
      ? localStorage.getItem("loggedInOwnerId")
      : null;

  if (!loggedInOwnerId) {
    return null;
  }

  return children;
}