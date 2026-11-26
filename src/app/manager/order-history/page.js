
"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Search,
  RefreshCw,
  CalendarDays,
  Utensils,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    paidRevenue: 0,
  });

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("status", activeFilter);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (fromDate) {
        params.set("from", fromDate);
      }

      if (toDate) {
        params.set("to", toDate);
      }

      const response = await fetch(
        `/api/manager/order-history?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch order history");
      }

      setOrders(data.orders || []);
      setSummary(data.summary || {
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        paidRevenue: 0,
      });

    } catch (err) {
      console.error("Order History Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [activeFilter, search, fromDate, toDate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const summaryCards = [
    {
      title: "Total Orders",
      value: summary.totalOrders,
      icon: ShoppingBag,
      color: "bg-[#F0F5F0] text-[#286149]",
    },
    {
      title: "Completed Orders",
      value: summary.completedOrders,
      icon: CheckCircle2,
      color: "bg-[#E5F3E9] text-[#34764D]",
    },
    {
      title: "Cancelled Orders",
      value: summary.cancelledOrders,
      icon: XCircle,
      color: "bg-[#FFF0F0] text-[#C85C5C]",
    },
    {
      title: "Paid Revenue",
      value: `₹${formatAmount(summary.paidRevenue)}`,
      icon: IndianRupee,
      color: "bg-[#F9EEDB] text-[#A87936]",
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Served") {
      return "bg-[#E5F3E9] text-[#34764D]";
    }

    if (status === "Cancelled") {
      return "bg-[#FFF0F0] text-[#C85C5C]";
    }

    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#B9822E]">
            Restaurant Operations
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17392D]">
            Order History
          </h1>

          <p className="mt-1.5 text-sm text-[#849087]">
            Track completed and cancelled restaurant orders.
          </p>
        </div>

        <button
          onClick={fetchOrderHistory}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D6AD70] px-5 py-3 text-sm font-semibold text-[#17392D] shadow-sm transition hover:bg-[#C49A5E] disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh History
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E6D9C9] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#829087]">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#17392D]">
                    {item.value}
                  </h2>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER SECTION */}
      <section className="rounded-2xl border border-[#E6D9C9] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col gap-4">

          <div>
            <h2 className="text-lg font-bold text-[#17392D]">
              Order Records
            </h2>

            <p className="mt-1 text-sm text-[#87938B]">
              Search and filter your previous orders.
            </p>
          </div>

          {/* STATUS FILTER */}
          <div className="flex flex-wrap gap-2">
            {["All", "Served", "Cancelled"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                  activeFilter === filter
                    ? "bg-[#17392D] text-white"
                    : "border border-[#E6D9C9] bg-[#F7F4EE] text-[#716B64] hover:bg-[#EFE9DE]"
                }`}
              >
                {filter === "All" ? "All Orders" : filter}
              </button>
            ))}
          </div>

          {/* SEARCH + DATE FILTER */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9289]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Order ID or Table..."
                className="w-full rounded-xl border border-[#E6D9C9] bg-[#FFFEFC] py-3 pl-10 pr-4 text-sm text-[#17392D] outline-none focus:border-[#D6AD70]"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9289]"
              />

              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-[#E6D9C9] bg-[#FFFEFC] py-3 pl-10 pr-3 text-sm text-[#17392D] outline-none focus:border-[#D6AD70]"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9289]"
              />

              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-[#E6D9C9] bg-[#FFFEFC] py-3 pl-10 pr-3 text-sm text-[#17392D] outline-none focus:border-[#D6AD70]"
              />
            </div>

          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearch("");
                setFromDate("");
                setToDate("");
                setActiveFilter("All");
              }}
              className="text-xs font-semibold text-[#A87936] hover:text-[#17392D]"
            >
              Clear All Filters
            </button>
          </div>

        </div>
      </section>

      {/* ORDER LIST */}
      <section className="overflow-hidden rounded-2xl border border-[#E6D9C9] bg-white shadow-sm">

        <div className="border-b border-[#EEE7DD] px-5 py-5 sm:px-6">
          <h2 className="text-lg font-bold text-[#17392D]">
            Previous Orders
          </h2>

          <p className="mt-1 text-sm text-[#87938B]">
            {orders.length} orders found
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center gap-3">
            <RefreshCw size={18} className="animate-spin text-[#D6AD70]" />
            <p className="text-sm text-[#716B64]">Loading order history...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="font-medium text-red-600">{error}</p>
            <button
              onClick={fetchOrderHistory}
              className="mt-4 rounded-lg bg-[#17392D] px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7F4EE] text-[#A87936]">
              <ShoppingBag size={27} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#17392D]">
              No Orders Found
            </h3>

            <p className="mt-2 text-sm text-[#89958D]">
              Try changing your search or date filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4 sm:p-5">

            {orders.map((order) => {
              const isExpanded = expandedOrder === order._id;

              return (
                <article
                  key={order._id}
                  className="rounded-xl border border-[#E8EDE9] bg-white p-4 transition hover:border-[#D6AD70] sm:p-5"
                >

                  {/* ORDER HEADER */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F4EE] text-[#A87936]">
                        <ShoppingBag size={19} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#9A9289]">
                          Order ID
                        </p>

                        <h3 className="mt-1 text-sm font-bold text-[#17392D]">
                          {order.orderNumber}
                        </h3>

                        <p className="mt-1 text-xs text-[#87938B]">
                          Table {order.tableNumber} · {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#9A9289]">
                          Order Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#17392D]">
                          ₹{formatAmount(order.totalAmount)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>

                        <span className={`text-[11px] font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "text-[#34764D]"
                            : "text-[#A87936]"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* ITEMS PREVIEW */}
                  <div className="mt-4 rounded-xl bg-[#F8FAF8] px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1.3px] text-[#8A998F]">
                      <Utensils size={13} />
                      Order Items
                    </div>

                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div
                          key={item._id || index}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="text-[#52675B]">
                            <span className="font-semibold text-[#17392D]">
                              {item.quantity} ×
                            </span>{" "}
                            {item.name}
                          </span>

                          <span className="shrink-0 font-semibold text-[#52675B]">
                            ₹{formatAmount(item.total)}
                          </span>
                        </div>
                      ))}

                      {order.items.length > 2 && (
                        <p className="text-xs font-semibold text-[#A87936]">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DETAILS TOGGLE */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order._id)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E6D9C9] px-4 py-2 text-xs font-semibold text-[#17392D] transition hover:bg-[#F7F4EE]"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}

                      {isExpanded ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>
                  </div>

                  {/* EXPANDED DETAILS */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-[#EEE7DD] pt-4">

                      <h4 className="text-sm font-bold text-[#17392D]">
                        Complete Order Details
                      </h4>

                      {order.items.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="flex flex-wrap justify-between gap-3 rounded-lg bg-[#F8FAF8] p-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#17392D]">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-[#87938B]">
                              {item.selectedSize || "Standard"}
                              {item.selectedQuantity
                                ? ` · ${item.selectedQuantity}`
                                : ""}
                            </p>

                            <p className="mt-1 text-xs text-[#87938B]">
                              ₹{formatAmount(item.price)} × {item.quantity}
                            </p>
                          </div>

                          <p className="text-sm font-bold text-[#17392D]">
                            ₹{formatAmount(item.total)}
                          </p>
                        </div>
                      ))}

                      <div className="flex justify-between border-t border-[#EEE7DD] pt-3">
                        <span className="text-sm font-semibold text-[#716B64]">
                          Total Amount
                        </span>

                        <span className="text-lg font-bold text-[#17392D]">
                          ₹{formatAmount(order.totalAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-[#87938B]">
                        <span>Last Updated</span>
                        <span>{formatDate(order.updatedAt)}</span>
                      </div>

                    </div>
                  )}

                </article>
              );
            })}

          </div>
        )}
      </section>

    </div>
  );
}
