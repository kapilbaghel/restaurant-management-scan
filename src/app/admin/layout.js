"use client";

import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <AdminProtectedRoute>
      {children}
    </AdminProtectedRoute>
  );
}