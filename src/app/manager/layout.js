
"use client";

import { usePathname } from "next/navigation";
import ManagerProtectedRoute from "@/components/ManagerProtectedRoute";
import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerHeader from "@/components/manager/ManagerHeader";

export default function ManagerLayout({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/manager/login";

  return (
    <ManagerProtectedRoute>
      {isLoginPage ? (
        <div className="min-h-screen bg-[#F6F2EC]">
          {children}
        </div>
      ) : (
        <div className="min-h-screen bg-[#F6F2EC]">
          <ManagerSidebar />

          <div className="min-h-screen pl-64">
            <ManagerHeader />

            <main className="min-h-[calc(100vh-68px)] p-8">
              {children}
            </main>
          </div>
        </div>
      )}
    </ManagerProtectedRoute>
  );
}
