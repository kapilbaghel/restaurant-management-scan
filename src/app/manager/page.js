"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  IndianRupee,
  Clock,
  Utensils,
  ArrowUpRight,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  MapPin,
  Phone,
  Store,
  ReceiptText,
} from "lucide-react";

export default function ManagerDashboard() {
  const router = useRouter();

  const [manager, setManager] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    totalMenuItems: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await fetch("/api/manager/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          router.replace("/manager/login");
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load dashboard.");
        }

        setManager(data.manager);
        setRestaurant(data.restaurant);
      } catch (err) {
        console.error("Manager Dashboard Error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [router]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/manager/dashboard/stats", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();
        console.log("Dashboard Stats API:", data);

        if (response.ok && data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch(
          "/api/manager/dashboard/recent-orders",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setRecentOrders(data.orders);
        }
      } catch (error) {
        console.error("Recent Orders Error:", error);
      }
    };

    fetchRecentOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DCE8E1] border-t-[#174638]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 text-red-600 shadow-sm">
        {error}
      </div>
    );
  }

  if (!manager) return null;

  const statCards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      note: "Orders received today",
      icon: ShoppingBag,
      iconBg: "bg-[#F7EBDD]",
      iconColor: "text-[#B87932]",
      accent: "bg-[#D6A45B]",
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString("en-IN")}`,
      note: "Revenue generated today",
      icon: IndianRupee,
      iconBg: "bg-[#E4F0E9]",
      iconColor: "text-[#247653]",
      accent: "bg-[#39845F]",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      note: "Orders awaiting action",
      icon: Clock,
      iconBg: "bg-[#FBEAEA]",
      iconColor: "text-[#D64B4B]",
      accent: "bg-[#D85A55]",
    },
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      note: "Items in your menu",
      icon: Utensils,
      iconBg: "bg-[#EAEAF5]",
      iconColor: "text-[#6666A5]",
      accent: "bg-[#7777AE]",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7 pb-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#B48745]">
            Restaurant operations
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#173D32] sm:text-3xl">
            Good to see you, {manager.name}
          </h1>
          <p className="mt-2 text-sm text-[#7D817B]">
            Here's what's happening at your restaurant today.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E8DED0] bg-white px-4 py-3 text-sm font-medium text-[#59645D] shadow-sm">
          <CalendarDays size={17} className="text-[#B48745]" />
          <span>
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </section>

      {/* Restaurant banner */}
      {restaurant && (
        <section className="relative overflow-hidden rounded-[26px] bg-[#173D32] px-6 py-7 text-white shadow-[0_16px_40px_rgba(23,61,50,0.12)] sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-16 h-52 w-52 rounded-full border border-white/10" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E4BE7B]">
                <Store size={15} /> Currently managing
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {restaurant.name}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
                <MapPin size={15} />
                {[restaurant.address, restaurant.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6A45B] text-[#173D32]">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-white/60">Restaurant contact</p>
                <p className="mt-1 text-base font-semibold">
                  {restaurant.phone || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Overview cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#173D32]">Restaurant overview</h2>
            <p className="mt-1 text-sm text-[#85877F]">
              Your restaurant's performance at a glance
            </p>
          </div>
          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0EA] text-[#28664D] sm:flex">
            <TrendingUp size={19} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-[22px] border border-[#E9E0D5] bg-white p-5 shadow-[0_5px_20px_rgba(50,40,25,0.035)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(50,40,25,0.08)] sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconColor}`}>
                    <Icon size={21} strokeWidth={1.9} />
                  </div>
                  <ArrowUpRight size={18} className="text-[#B9B2A8] transition group-hover:text-[#B48745]" />
                </div>
                <p className="mt-5 text-sm font-medium text-[#777B74]">
                  {stat.title}
                </p>
                <h3 className="mt-2 text-[32px] font-bold leading-none tracking-tight text-[#173D32]">
                  {stat.value}
                </h3>
                <p className="mt-3 text-xs text-[#A09C93]">{stat.note}</p>
                <div className={`absolute bottom-0 left-0 h-[3px] w-full ${stat.accent} opacity-80`} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent orders */}
      <section className="overflow-hidden rounded-[24px] border border-[#E9E0D5] bg-white shadow-[0_5px_20px_rgba(50,40,25,0.035)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#F0EAE1] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0EA] text-[#28664D]">
                <ReceiptText size={18} />
              </div>
              <h2 className="text-lg font-bold text-[#173D32]">Recent orders</h2>
            </div>
            <p className="mt-2 text-sm text-[#85877F]">
              Keep track of your latest restaurant orders.
            </p>
          </div>

          <button
            onClick={() => router.push("/manager/orders")}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#DCC8A9] px-4 py-2.5 text-sm font-semibold text-[#916B32] transition hover:border-[#173D32] hover:bg-[#173D32] hover:text-white"
          >
            View all orders
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="flex min-h-[210px] items-center justify-center px-5 py-10 text-center">
              <div>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F0E5] text-[#B48745]">
                  <ShoppingBag size={25} />
                </div>
                <h3 className="font-semibold text-[#263D33]">No orders found</h3>
                <p className="mt-1 text-sm text-[#92938C]">
                  New customer orders will appear here.
                </p>
              </div>
            </div>
          ) : (
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-[0.1em] text-[#8B8174]">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Table</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Order status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-[#F1ECE5] text-sm transition hover:bg-[#FCFAF7]"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#173D32]">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-[#6F756F]">
                      {order.tableNumber || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#263D33]">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-[#FFF3DE] px-3 py-1.5 text-xs font-semibold text-[#A66D1D]">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "bg-[#E5F3EA] text-[#24734D]"
                            : "bg-[#FFF3DE] text-[#A66D1D]"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-[#85877F]">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {recentOrders.length > 0 && (
          <div className="border-t border-[#F0EAE1] px-6 py-3 text-xs text-[#99958D]">
            Showing your latest {recentOrders.length} orders
          </div>
        )}
      </section>
    </div>
  );
}
