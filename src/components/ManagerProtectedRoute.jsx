"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ManagerProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/manager/login") {
      setAuthorized(true);
      return;
    }

    let isMounted = true;

    const verifyManager = async () => {
      try {
        const response = await fetch("/api/manager/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.replace("/login");
          return;
        }

        if (isMounted) {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Manager authentication error:", error);
      router.replace("/login");
      }
    };

    verifyManager();

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}