
"use client";

import { useEffect, useState, useRef } from "react";
import {
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle2,
  RefreshCw,
  Volume2,
  Utensils,
} from "lucide-react";

const filters = [
  "All Orders",
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Served",
];

export default function LiveOrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const previousOrderIdsRef = useRef(null);
const notificationAudioRef = useRef(null);

useEffect(() => {
  const unlockAudio = () => {
    const audio = notificationAudioRef.current;

    if (audio) {
      audio.muted = true;

      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {
          audio.muted = false;
        });
    }

    document.removeEventListener("click", unlockAudio);
  };

  document.addEventListener("click", unlockAudio);

  return () => {
    document.removeEventListener("click", unlockAudio);
  };
}, []);

  const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`/api/manager/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update order");
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === orderId
          ? { ...order, status: data.order.status }
          : order
      )
    );
  } catch (error) {
    console.error("Update Order Status Error:", error);
    alert(error.message);
  }
};

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      setError("");

      const response = await fetch("/api/manager/orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      if (previousOrderIdsRef.current !== null) {
        const previousIds = previousOrderIdsRef.current;

        const newOrders = data.orders.filter(
          (order) => !previousIds.includes(order._id)
        );

        console.log("Previous Orders:", previousIds);
        console.log(
          "Fetched Orders:",
          data.orders.map((order) => order._id)
        );
        console.log("New Orders Detected:", newOrders.length);

        if (newOrders.length > 0 && notificationAudioRef.current) {
          console.log("AUDIO TRIGGERED", notificationAudioRef.current);

          const audio = notificationAudioRef.current;
          audio.muted = false;
          audio.currentTime = 0;

          audio.play()
            .then(() => console.log("AUDIO PLAYING SUCCESSFULLY"))
            .catch((error) => {
              console.error("Notification Playback Error:", error);
            });
        }
      }

      previousOrderIdsRef.current = data.orders.map(
        (order) => order._id
      );

      setOrders(data.orders);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();

  const intervalId = setInterval(() => {
    fetchOrders();
  }, 5000);

  return () => clearInterval(intervalId);
}, []);


  const summaryCards = [
    {
      title: "New Orders",
      value: orders.filter((order) => order.status === "Pending").length,
      icon: ShoppingBag,
      iconStyle: "bg-[#F9EEDB] text-[#B9822E]",
      accent: "border-l-[#D9A653]",
    },
    {
      title: "Accepted",
      value: orders.filter((order) => order.status === "Accepted").length,
      icon: Clock,
      iconStyle: "bg-[#E8EEF8] text-[#5475A8]",
      accent: "border-l-[#7896C5]",
    },
    {
      title: "Preparing",
      value: orders.filter((order) => order.status === "Preparing").length,
      icon: ChefHat,
      iconStyle: "bg-[#FBEBDD] text-[#C47A35]",
      accent: "border-l-[#D88B4B]",
    },
    {
      title: "Ready to Serve",
      value: orders.filter((order) => order.status === "Ready").length,
      icon: CheckCircle2,
      iconStyle: "bg-[#E4F1E9] text-[#37815A]",
      accent: "border-l-[#4E9B70]",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFF3D9] text-[#9A681B]";
      case "Accepted":
        return "bg-[#EAF0FA] text-[#496B9D]";
      case "Preparing":
        return "bg-[#FCEBDD] text-[#A95F26]";
      case "Ready":
        return "bg-[#E5F3E9] text-[#34764D]";
      case "Served":
        return "bg-[#E9EDEB] text-[#52635A]";
      default:
        return "bg-[#F1F2F1] text-[#59635E]";
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5EAE6] bg-white px-6 py-4 shadow-sm">
          <RefreshCw size={17} className="animate-spin text-[#D9A653]" />
          <p className="text-sm font-medium text-[#60736A]">Loading orders...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-700">{error}</p>
      </div>
    );
  }

  // MAIN PAGE
  return (
    <div className="space-y-6">
      <audio
        ref={notificationAudioRef}
        src="/sounds/new-order.mp3"
        preload="auto"
      />

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#B9822E]">
            Restaurant Operations
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#173D32]">
            Live Orders
          </h1>
          <p className="mt-1.5 text-sm text-[#849087]">
            Monitor incoming orders and keep your kitchen running smoothly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const audio = notificationAudioRef.current;
              if (audio) {
                audio.muted = false;
                audio.currentTime = 0;
                audio.play().catch((error) => {
                  console.error("Audio Error:", error);
                  alert(error.message);
                });
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E3EAE5] bg-white px-4 py-3 text-sm font-semibold text-[#456052] shadow-sm transition hover:border-[#C9D8CE] hover:bg-[#F8FBF8]"
          >
            <Volume2 size={16} />
            Test Sound
          </button>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D9A653] px-4 py-3 text-sm font-semibold text-[#173D32] shadow-sm transition hover:bg-[#E4B766]"
          >
            <RefreshCw size={16} />
            Refresh Orders
          </button>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`rounded-2xl border border-[#E5EAE6] border-l-4 ${item.accent} bg-white p-5 shadow-[0_4px_18px_rgba(23,61,50,0.04)]`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#829087]">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold tabular-nums text-[#173D32]">
                    {item.value}
                  </h2>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconStyle}`}>
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ORDER MANAGEMENT */}
      <section className="overflow-hidden rounded-2xl border border-[#E5EAE6] bg-white shadow-[0_5px_24px_rgba(23,61,50,0.045)]">
        <div className="border-b border-[#EDF0ED] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2EC] text-[#286149]">
                  <ShoppingBag size={17} />
                </div>
                <h2 className="text-lg font-bold text-[#173D32]">
                  Order Management
                </h2>
              </div>
              <p className="mt-2 text-sm text-[#87938B]">
                View and manage orders by their current status.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    activeFilter === filter
                      ? "bg-[#173D32] text-white shadow-sm"
                      : "border border-[#E7ECE8] bg-[#F8FAF8] text-[#718077] hover:border-[#C9D8CE] hover:bg-[#EEF4EF]"
                  }`}
                >
                  {filter}
                  {filter === "All Orders" && (
                    <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${
                      activeFilter === filter
                        ? "bg-white/15 text-white"
                        : "bg-[#E8EEE9] text-[#587064]"
                    }`}>
                      {orders.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F5F0] text-[#64816F]">
              <ShoppingBag size={27} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#173D32]">
              No Orders Yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-[#89958D]">
              New customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4 sm:p-5">
            {orders
              .filter((order) => {
                if (activeFilter === "All Orders") return true;
                return order.status === activeFilter;
              })
              .map((order) => (
                <article
                  key={order._id}
                  className="rounded-xl border border-[#E8EDE9] bg-white p-4 transition hover:border-[#C9D8CE] hover:shadow-[0_4px_16px_rgba(23,61,50,0.05)] sm:p-5"
                >
                  {/* ORDER DETAILS */}
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-[#286149]">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A0AAA3]">
                          Order ID
                        </p>
                        <h3 className="mt-1 text-sm font-bold text-[#173D32]">
                          {order.orderNumber}
                        </h3>
                        <p className="mt-1 text-xs text-[#87938B]">
                          Table{" "}
                          <span className="font-semibold text-[#52675B]">
                            {order.tableNumber}
                          </span>
                          <span className="mx-2 text-[#D5DDD7]">•</span>
                          {new Date(order.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A0AAA3]">
                        Order Total
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#173D32]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* ORDER ITEMS */}
                  <div className="mt-4 rounded-xl bg-[#F8FAF8] px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1.3px] text-[#8A998F]">
                      <Utensils size={13} />
                      Order Items
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="text-[#52675B]">
                            <span className="font-semibold text-[#173D32]">
                              {item.quantity} ×
                            </span>{" "}
                            {item.name}
                          </span>
                          <span className="shrink-0 font-semibold text-[#52675B]">
                            ₹{item.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STATUS + ACTIONS */}
                  <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="rounded-full bg-[#F1F3F2] px-3 py-1.5 text-[11px] font-semibold text-[#66746B]">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order.status === "Pending" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "Accepted")}
                          className="rounded-lg bg-[#D9A653] px-4 py-2.5 text-xs font-bold text-[#173D32] transition hover:bg-[#E4B766]"
                        >
                          Accept Order
                        </button>
                      )}

                      {order.status === "Accepted" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "Preparing")}
                          className="rounded-lg bg-[#173D32] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#245443]"
                        >
                          Start Preparing
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "Ready")}
                          className="rounded-lg bg-[#34764D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#28613E]"
                        >
                          Mark Ready
                        </button>
                      )}

                      {order.status === "Ready" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "Served")}
                          className="rounded-lg bg-[#263A31] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#172A22]"
                        >
                          Mark Served
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
