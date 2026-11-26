
"use client";

import { useEffect, useState } from "react";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
export default function TablesPage() {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
const [tableNumber, setTableNumber] = useState("");
const [capacity, setCapacity] = useState("2");
const [saving, setSaving] = useState(false);
const [modalError, setModalError] = useState("");
const [tables, setTables] = useState([]);
const [tablesLoading, setTablesLoading] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [editingTable, setEditingTable] = useState(null);
const [deletingTableId, setDeletingTableId] = useState("");
const [generatingQR, setGeneratingQR] = useState(false);
const [qrMessage, setQrMessage] = useState("");
const [qrError, setQrError] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/owners/restaurants");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load branches.");
        }

const restaurantList = data.restaurants || [];

// Main branch ko dropdown mein sabse upar rakho
const sortedBranches = [...restaurantList].sort((a, b) => {
  if (a.branchType === "main") return -1;
  if (b.branchType === "main") return 1;
  return 0;
});

setBranches(sortedBranches);

// Automatically select Main Branch
const mainBranch = sortedBranches.find(
  (branch) => branch.branchType === "main"
);

if (mainBranch) {
  setSelectedBranchId(mainBranch._id || mainBranch.id);
} else if (sortedBranches.length > 0) {
  setSelectedBranchId(
    sortedBranches[0]._id || sortedBranches[0].id
  );
}

      } catch (error) {
        console.error("Fetch Branches Error:", error);
        setError(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);




const fetchTables = async (branchId) => {
  if (!branchId) {
    setTables([]);
    return;
  }

  try {
    setTablesLoading(true);

    const response = await fetch(
      `/api/owners/tables?restaurantId=${branchId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load tables.");
    }

    setTables(data.tables || []);
  } catch (error) {
    console.error("Fetch Tables Error:", error);
    setTables([]);
  } finally {
    setTablesLoading(false);
  }
};

  useEffect(() => {
  if (selectedBranchId) {
    fetchTables(selectedBranchId);
  } else {
    setTables([]);
  }
}, [selectedBranchId]);


const handleEditTable = (table) => {
  setEditingTable(table);
  setTableNumber(table.tableNumber);
  setCapacity(String(table.capacity));
  setModalError("");
  setShowEditModal(true);
};


const handleUpdateTable = async () => {
  setModalError("");

  if (!editingTable) return;

  if (!tableNumber.trim()) {
    setModalError("Please enter a table number.");
    return;
  }

  try {
    setSaving(true);

    const response = await fetch("/api/owners/tables", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableId: editingTable._id || editingTable.id,
        restaurantId: selectedBranchId,
        tableNumber: tableNumber.trim(),
        capacity: Number(capacity),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update table.");
    }

    await fetchTables(selectedBranchId);

    setShowEditModal(false);
    setEditingTable(null);
    setTableNumber("");
    setCapacity("2");
    setModalError("");

  } catch (error) {
    console.error("Update Table Error:", error);
    setModalError(error.message || "Something went wrong.");
  } finally {
    setSaving(false);
  }
};


const handleDeleteTable = async () => {
  if (!deletingTableId) return;

  try {
    setSaving(true);

    const response = await fetch("/api/owners/tables", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableId: deletingTableId,
        restaurantId: selectedBranchId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete table.");
    }

    await fetchTables(selectedBranchId);
    setDeletingTableId("");
  } catch (error) {
    console.error("Delete Table Error:", error);
    setModalError(error.message || "Something went wrong.");
  } finally {
    setSaving(false);
  }
};

  const handleSaveTable = async () => {
  setModalError("");

  if (!selectedBranchId) {
    setModalError("Please select a restaurant branch.");
    return;
  }

  if (!tableNumber.trim()) {
    setModalError("Please enter a table number.");
    return;
  }

  if (!capacity || Number(capacity) < 1) {
    setModalError("Please select a valid seating capacity.");
    return;
  }

  try {
    setSaving(true);

    const response = await fetch("/api/owners/tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurantId: selectedBranchId,
        tableNumber: tableNumber.trim(),
        capacity: Number(capacity),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create table.");
    }

    await fetchTables(selectedBranchId);

    setShowAddModal(false);
    setTableNumber("");
    setCapacity("2");
    setModalError("");

  } catch (error) {
    console.error("Save Table Error:", error);
    setModalError(error.message || "Something went wrong.");
  } finally {
    setSaving(false);
  }
};

const handleGenerateQR = async () => {
  if (!selectedBranchId) {
    setQrError("Please select a branch first.");
    return;
  }

  setGeneratingQR(true);
  setQrMessage("");
  setQrError("");

  try {
    const response = await fetch("/api/owners/tables/generate-qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurantId: selectedBranchId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate QR codes.");
    }

    setQrMessage(data.message || "QR codes generated successfully.");

    await fetchTables(selectedBranchId);
  } catch (error) {
    setQrError(error.message || "Something went wrong.");
  } finally {
    setGeneratingQR(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      <OwnerSidebar />

      <main className="ml-64 min-h-screen px-8 py-8">
        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#C58A43]">
              Restaurant Operations
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#172D27]">
              Tables Management
            </h1>
            <p className="mt-2 text-sm text-[#81786E]">
              Manage your restaurant tables and generate table QR codes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerateQR}
              disabled={generatingQR || !selectedBranchId}
              className="rounded-xl border border-[#D9C5A8] bg-white px-5 py-3 text-sm font-semibold text-[#174237] shadow-sm transition hover:bg-[#F8F1E7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingQR ? "Generating QR..." : "Generate Missing QR Codes"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              disabled={!selectedBranchId}
              className="rounded-xl bg-[#D5A45F] px-5 py-3 text-sm font-semibold text-[#172D27] shadow-sm transition hover:bg-[#C8954E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add New Table
            </button>
          </div>
        </div>

        {/* Branch selector */}
        <section className="mb-6 rounded-2xl border border-[#E9DED1] bg-white p-5 shadow-[0_8px_28px_rgba(48,38,25,0.04)]">
          <div className="grid gap-4 md:grid-cols-[minmax(0,380px)_1fr] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#273A33]">
                Select Restaurant Branch
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                disabled={loading || branches.length === 0}
                className="w-full rounded-xl border border-[#E5D8C9] bg-[#FAF7F2] px-4 py-3 text-sm text-[#273A33] outline-none transition focus:border-[#C99A5B] focus:ring-2 focus:ring-[#D5A45F]/20 disabled:opacity-60"
              >
                {loading ? (
                  <option key="loading" value="">Loading branches...</option>
                ) : branches.length === 0 ? (
                  <option key="empty" value="">No branches available</option>
                ) : (
                  branches.map((branch, index) => (
                    <option
                      key={branch._id || branch.id || `${branch.name}-${index}`}
                      value={branch._id || branch.id}
                    >
                      {branch.name} — {branch.city}
                    </option>
                  ))
                )}
              </select>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <p className="text-sm text-[#8B8176] md:pb-3">
              Tables shown below belong to the selected restaurant branch.
            </p>
          </div>
        </section>

        {/* Summary cards */}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-[#E9DED1] bg-white p-5 shadow-[0_8px_28px_rgba(48,38,25,0.04)]">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#F8EBDD]" />
            <div className="relative">
              <p className="text-sm font-medium text-[#82786D]">Total Tables</p>
              <p className="mt-3 text-4xl font-bold text-[#172D27]">{tables.length}</p>
              <p className="mt-2 text-xs font-medium text-[#B47A37]">Tables in selected branch</p>
              <div className="mt-5 h-1 rounded-full bg-[#D5A45F]" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-[#E9DED1] bg-white p-5 shadow-[0_8px_28px_rgba(48,38,25,0.04)]">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#E5F1EA]" />
            <div className="relative">
              <p className="text-sm font-medium text-[#82786D]">QR Generated</p>
              <p className="mt-3 text-4xl font-bold text-[#087A50]">{tables.filter((table) => table.qrCode).length}</p>
              <p className="mt-2 text-xs font-medium text-[#087A50]">Tables with QR codes</p>
              <div className="mt-5 h-1 rounded-full bg-[#087A50]" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-[#E9DED1] bg-white p-5 shadow-[0_8px_28px_rgba(48,38,25,0.04)]">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#FBE9E7]" />
            <div className="relative">
              <p className="text-sm font-medium text-[#82786D]">QR Pending</p>
              <p className="mt-3 text-4xl font-bold text-[#D94343]">{tables.filter((table) => !table.qrCode).length}</p>
              <p className="mt-2 text-xs font-medium text-[#D94343]">Tables without QR codes</p>
              <div className="mt-5 h-1 rounded-full bg-[#D94343]" />
            </div>
          </div>
        </section>

        {(qrMessage || qrError) && (
          <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${qrError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {qrError || qrMessage}
          </div>
        )}

        {/* Tables list */}
        <section className="rounded-2xl border border-[#E9DED1] bg-white p-6 shadow-[0_8px_28px_rgba(48,38,25,0.04)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#172D27]">Restaurant Tables</h2>
              <p className="mt-1 text-sm text-[#81786E]">View table capacity, QR codes and manage each table.</p>
            </div>
            <span className="rounded-full bg-[#F8EBDD] px-4 py-2 text-sm font-semibold text-[#A66E2E]">
              {tables.length} {tables.length === 1 ? "Table" : "Tables"}
            </span>
          </div>

          {tablesLoading ? (
            <div className="flex min-h-40 items-center justify-center text-sm text-[#81786E]">Loading tables...</div>
          ) : tables.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DDCDBB] bg-[#FCFAF7] px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4E8D8] text-2xl text-[#A8753D]">▦</div>
              <h3 className="text-base font-semibold text-[#273A33]">No tables added yet</h3>
              <p className="mt-2 text-sm text-[#8B8176]">Add your first table to this branch to get started.</p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                disabled={!selectedBranchId}
                className="mt-5 rounded-xl bg-[#D5A45F] px-5 py-3 text-sm font-semibold text-[#172D27] hover:bg-[#C8954E] disabled:opacity-50"
              >
                + Add New Table
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {tables.map((table) => (
                <article key={table._id || table.id} className="overflow-hidden rounded-2xl border border-[#E9DED1] bg-[#FFFEFC] transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="h-1.5 bg-[#D5A45F]" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B47A37]">Restaurant Table</p>
                        <h3 className="mt-1 text-2xl font-bold text-[#172D27]">Table {table.tableNumber}</h3>
                      </div>
                      <span className="rounded-full bg-[#E8F3EC] px-3 py-1 text-xs font-semibold capitalize text-[#087A50]">
                        {table.status || "Active"}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F8F4EE] px-4 py-3">
                      <span className="text-sm text-[#81786E]">Seating capacity</span>
                      <span className="text-sm font-bold text-[#273A33]">{table.capacity} Seats</span>
                    </div>

                    {table.qrCode ? (
                      <div className="mt-5 rounded-xl border border-[#E9DED1] bg-white p-4 text-center">
                        <p className="mb-3 text-sm font-semibold text-[#273A33]">Table QR Code</p>
                        <img
                          src={table.qrCode}
                          alt={`QR Code for Table ${table.tableNumber}`}
                          className="mx-auto h-36 w-36 rounded-lg border border-[#EEE5DB] bg-white p-2 object-contain"
                        />
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = table.qrCode;
                              link.download = `Table-${table.tableNumber}-QR.png`;
                              link.click();
                            }}
                            className="rounded-lg border border-[#D9C5A8] px-3 py-2 text-xs font-semibold text-[#174237] transition hover:bg-[#F8F1E7]"
                          >
                            Download QR
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const printWindow = window.open("", "_blank");
                              if (!printWindow) {
                                alert("Please allow pop-ups to print QR code.");
                                return;
                              }
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Table ${table.tableNumber} QR Code</title>
                                    <style>
                                      body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif; }
                                      img { width: 280px; height: 280px; }
                                    </style>
                                  </head>
                                  <body>
                                    <h2>Table ${table.tableNumber}</h2>
                                    <img src="${table.qrCode}" />
                                    <script>window.onload = function() { window.print(); }<\/script>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }}
                            className="rounded-lg bg-[#0B3B30] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#062D25]"
                          >
                            Print QR
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-[#E2CBAE] bg-[#FCF8F1] px-4 text-center">
                        <span className="text-sm font-semibold text-[#A66E2E]">QR Code not generated yet</span>
                        <span className="mt-1 text-xs text-[#8B8176]">Use Generate Missing QR Codes above.</span>
                      </div>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#EFE5DA] pt-4">
                      <button
                        type="button"
                        onClick={() => handleEditTable(table)}
                        className="rounded-xl border border-[#D9C5A8] px-4 py-2.5 text-sm font-semibold text-[#80572D] transition hover:bg-[#FAF2E8]"
                      >
                        Edit Table
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingTableId(table._id || table.id)}
                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071F19]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#E9DED1] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#EFE5DA] bg-[#FCF9F5] px-7 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#172D27]">Add New Table</h2>
                <p className="mt-1 text-sm text-[#81786E]">Enter table details for the selected branch.</p>
              </div>
              <button type="button" onClick={() => { setShowAddModal(false); setTableNumber(""); setCapacity("2"); setModalError(""); }} className="rounded-lg p-2 text-[#81786E] hover:bg-[#F0E8DE]" aria-label="Close">✕</button>
            </div>
            <div className="space-y-5 p-7">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#273A33]">Table Number</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. T01"
                  className="w-full rounded-xl border border-[#E5D8C9] bg-[#FAF7F2] px-4 py-3 text-sm outline-none transition placeholder:text-[#A69B90] focus:border-[#C99A5B] focus:ring-2 focus:ring-[#D5A45F]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#273A33]">Seating Capacity</label>
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full rounded-xl border border-[#E5D8C9] bg-[#FAF7F2] px-4 py-3 text-sm outline-none transition focus:border-[#C99A5B] focus:ring-2 focus:ring-[#D5A45F]/20"
                >
                  <option value="2">2 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="6">6 Seats</option>
                  <option value="8">8 Seats</option>
                </select>
              </div>
              {modalError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{modalError}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-[#EFE5DA] bg-[#FCF9F5] px-7 py-5">
              <button type="button" onClick={() => { setShowAddModal(false); setTableNumber(""); setCapacity("2"); setModalError(""); }} disabled={saving} className="rounded-xl border border-[#E2D5C7] bg-white px-5 py-3 text-sm font-semibold text-[#51483F] hover:bg-[#F8F4EE] disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleSaveTable} disabled={saving} className="rounded-xl bg-[#D5A45F] px-5 py-3 text-sm font-semibold text-[#172D27] shadow-sm hover:bg-[#C8954E] disabled:opacity-50">{saving ? "Saving..." : "Save Table"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071F19]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#E9DED1] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#EFE5DA] bg-[#FCF9F5] px-7 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#172D27]">Edit Table</h2>
                <p className="mt-1 text-sm text-[#81786E]">Update table details.</p>
              </div>
              <button type="button" onClick={() => { setShowEditModal(false); setEditingTable(null); setTableNumber(""); setCapacity("2"); setModalError(""); }} className="rounded-lg p-2 text-[#81786E] hover:bg-[#F0E8DE]" aria-label="Close">✕</button>
            </div>
            <div className="space-y-5 p-7">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#273A33]">Table Number</label>
                <input type="text" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full rounded-xl border border-[#E5D8C9] bg-[#FAF7F2] px-4 py-3 text-sm outline-none transition focus:border-[#C99A5B] focus:ring-2 focus:ring-[#D5A45F]/20" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#273A33]">Seating Capacity</label>
                <select value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full rounded-xl border border-[#E5D8C9] bg-[#FAF7F2] px-4 py-3 text-sm outline-none transition focus:border-[#C99A5B] focus:ring-2 focus:ring-[#D5A45F]/20">
                  <option value="2">2 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="6">6 Seats</option>
                  <option value="8">8 Seats</option>
                </select>
              </div>
              {modalError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{modalError}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-[#EFE5DA] bg-[#FCF9F5] px-7 py-5">
              <button type="button" onClick={() => { setShowEditModal(false); setEditingTable(null); setTableNumber(""); setCapacity("2"); setModalError(""); }} disabled={saving} className="rounded-xl border border-[#E2D5C7] bg-white px-5 py-3 text-sm font-semibold text-[#51483F] hover:bg-[#F8F4EE] disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleUpdateTable} disabled={saving} className="rounded-xl bg-[#D5A45F] px-5 py-3 text-sm font-semibold text-[#172D27] shadow-sm hover:bg-[#C8954E] disabled:opacity-50">{saving ? "Updating..." : "Update Table"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTableId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071F19]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#E9DED1] bg-white p-7 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-600">!</div>
            <h2 className="text-xl font-bold text-[#172D27]">Delete Table?</h2>
            <p className="mt-3 text-sm leading-6 text-[#81786E]">Are you sure you want to delete this table? This action cannot be undone.</p>
            {modalError && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{modalError}</p>}
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" onClick={() => { setDeletingTableId(""); setModalError(""); }} disabled={saving} className="rounded-xl border border-[#E2D5C7] px-5 py-3 text-sm font-semibold text-[#51483F] hover:bg-[#F8F4EE] disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleDeleteTable} disabled={saving} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{saving ? "Deleting..." : "Yes, Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
