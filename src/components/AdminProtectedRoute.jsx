"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

useEffect(() => {
  // Admin login page ko protect nahi karna
  if (pathname === "/admin/login") {
    setAuthorized(true);
    return;
  }

  const loggedInAdminId = localStorage.getItem("loggedInAdminId");

  if (!loggedInAdminId) {
    router.replace("/admin/login");
    return;
  }

  setAuthorized(true);
}, [router, pathname]);

  if (!authorized) {
    return null;
  }

  return children;
}