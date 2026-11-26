"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyAdmin() {
      try {
        setChecking(true);

        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          if (isMounted) {
            setAuthorized(false);
            router.replace("/login");
          }
          return;
        }

        if (isMounted) {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Admin verification error:", error);

        if (isMounted) {
          setAuthorized(false);
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    }

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  if (checking || !authorized) {
    return null;
  }

  return children;
}