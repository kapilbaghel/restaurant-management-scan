"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function OwnerLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}