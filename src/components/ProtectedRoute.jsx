"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Set Password page does NOT require login
    if (pathname === "/owner/set-password") {
      setAuthorized(true);
      return;
    }

    const loggedInOwnerId =
      localStorage.getItem("loggedInOwnerId");

    if (!loggedInOwnerId) {
      router.replace("/login");
      return;
    }

    setAuthorized(true);
  }, [router, pathname]);

  if (!authorized) return null;

  return children;
}