"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  UtensilsCrossed,
  ArrowUpRight,
  ArrowLeft,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ReceiptText,
} from "lucide-react";


function PublicMenuContent() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const tableId = searchParams.get("tableId");

  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [cartRestored, setCartRestored] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalView, setProfileModalView] = useState("profile");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [authenticatedCustomer, setAuthenticatedCustomer] = useState(null);
  const [customerSessionLoading, setCustomerSessionLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [currentView, setCurrentView] = useState("categories");

  const categories = menuData?.categories || [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const visibleCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      `${category.name || ""} ${category.description || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [categories, categorySearch]);

  const visibleItems = useMemo(() => {
    const items = activeCategory?.items || [];
    const query = itemSearch.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      `${item.name || ""} ${item.description || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [activeCategory, itemSearch]);

  const recommendedItems = useMemo(() => {
  return categories.flatMap((category) =>
    (category.items || [])
      .filter((item) => item.isRecommended)
      .map((item) => ({
        ...item,
        categoryName: category.name,
      }))
  );
}, [categories]);

  const addToCart = (item) => {
    const selectedSize = selectedVariants[item._id];

    const selectedVariant = item.variants?.length
      ? item.variants.find(
          (variant) =>
            variant.size === (selectedSize || item.variants[0].size)
        )
      : null;

    const cartItem = {
      ...item,
      price: selectedVariant ? selectedVariant.price : item.price,
      selectedSize: selectedVariant ? selectedVariant.size : "",
      selectedQuantity: selectedVariant ? selectedVariant.quantity : "",
    };

    const cartKey = `${item._id}-${cartItem.selectedSize}`;

    setCart((prevCart) => {
      const totalItemQuantity = prevCart
        .filter((entry) => entry._id === item._id)
        .reduce((total, entry) => total + entry.quantity, 0);

      const lassiItemNames = [
        "Mango Lassi",
        "Sweet Lassi",
        "Masala Chaas",
      ];

      if (
        lassiItemNames.includes(item.name.trim()) &&
        totalItemQuantity >= 50
      ) {
        alert(`Maximum 50 quantity allowed for ${item.name}.`);
        return prevCart;
      }

      const existingItem = prevCart.find(
        (entry) => entry.cartKey === cartKey
      );

      if (existingItem) {
        return prevCart.map((entry) =>
          entry.cartKey === cartKey
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [...prevCart, { ...cartItem, cartKey, quantity: 1 }];
    });
  };

  const updateQuantity = (cartKey, change) => {
    setCart((prevCart) => {
      const currentItem = prevCart.find(
        (item) => item.cartKey === cartKey
      );

      if (!currentItem) return prevCart;

      const totalItemQuantity = prevCart
        .filter((item) => item._id === currentItem._id)
        .reduce((total, item) => total + item.quantity, 0);

      const lassiItemNames = [
        "Mango Lassi",
        "Sweet Lassi",
        "Masala Chaas",
      ];

      if (
        change > 0 &&
        lassiItemNames.includes(currentItem.name.trim()) &&
        totalItemQuantity >= 50
      ) {
        alert(`Maximum 50 quantity allowed for ${currentItem.name}.`);
        return prevCart;
      }

      return prevCart
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

const placeOrder = async () => {
    if (!cart.length) {
      setOrderMessage("Your cart is empty.");
      return;
    }

    try {
      setOrderLoading(true);
      setOrderMessage("");

      const response = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          tableId,
          items: cart.map((item) => ({
            menuItemId: item._id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedQuantity: item.selectedQuantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to place order.");
      }

      setOrderMessage(
        `Order placed successfully! Order No: ${data.order.orderNumber}`
      );

      setCart([]);
      sessionStorage.removeItem(
  `customer_cart_${restaurantId}_${tableId}`
);
      setCurrentView("categories");
      setActiveCategory(null);
    } catch (err) {
      setOrderMessage(err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/public/menu?restaurantId=${restaurantId}&tableId=${tableId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load menu.");
        }

        setMenuData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (restaurantId && tableId) {
      fetchMenu();
    } else {
      setError("Restaurant or Table information is missing.");
      setLoading(false);
    }
  }, [restaurantId, tableId]);


useEffect(() => {
  const checkCustomerSession = async () => {
    try {
      const response = await fetch(
        "/api/public/customers/session",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success && data.authenticated && data.customer) {
        setAuthenticatedCustomer(data.customer);


      } else {
        setAuthenticatedCustomer(null);
      }
    } catch (err) {
      console.error("Customer session error:", err);
    } finally {
      setCustomerSessionLoading(false);
    }
  };

  checkCustomerSession();
}, []);


// Restore cart after returning from customer login
useEffect(() => {
  if (!restaurantId || !tableId) return;

  const cartKey = `customer_cart_${restaurantId}_${tableId}`;

  try {
    const savedCart = sessionStorage.getItem(cartKey);

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        setCart(parsedCart);
      }
    }
  } catch (error) {
    console.error("Cart restore error:", error);
  } finally {
    setCartRestored(true);
  }
}, [restaurantId, tableId]);

// Keep cart saved during login redirect
useEffect(() => {
  if (!cartRestored || !restaurantId || !tableId) return;

  const cartKey = `customer_cart_${restaurantId}_${tableId}`;

  try {
    sessionStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Cart save error:", error);
  }
}, [cart, cartRestored, restaurantId, tableId]);


  useEffect(() => {
    const fetchCustomerOrders = async () => {
    if (
  !showProfileModal ||
  !authenticatedCustomer ||
  profileModalView !== "orders"
) {
  return;
}

      setOrdersLoading(true);
      setOrdersError("");

      try {
        const response = await fetch(
         "/api/public/customers/orders",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setOrdersError(
            data.message || "Unable to load order history."
          );
          setCustomerOrders([]);
          return;
        }

        setCustomerOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch Customer Orders Error:", err);
        setOrdersError("Something went wrong while loading orders.");
        setCustomerOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchCustomerOrders();
}, [showProfileModal, authenticatedCustomer, profileModalView]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DCE5DE] border-t-[#1B3A2F]" />
          <p className="mt-4 text-sm font-medium text-[#66736B]">
            Preparing your menu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF] p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EDE4] text-2xl">
            !
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#202923]">
            Unable to load menu
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#727B74]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const { restaurant, table } = menuData;

  const foodTypeClasses = (foodType) => {
    if (foodType === "Veg") {
      return "border-emerald-600 text-emerald-700";
    }

    if (foodType === "Egg") {
      return "border-amber-500 text-amber-700";
    }

    return "border-rose-600 text-rose-700";
  };

  return (
    <main className="min-h-screen bg-[#F8F7F3] pb-28 text-[#242923]">
      {/* Restaurant identity header */}
<header className="relative isolate overflow-hidden bg-[#17392D] text-white">
  {/* Background image */}
  <div
    className="absolute inset-0 -z-20 bg-cover bg-center"
    style={{
      backgroundImage: "url('/traditional-taste-banner.png')",
    }}
  />

  {/* Dark overlay for readability */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/45 to-[#10271F]/90" />

  {/* Decorative circles */}
  <div className="absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full border border-white/15" />
  <div className="absolute -right-8 -top-16 -z-10 h-52 w-52 rounded-full border border-white/10" />

  <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-12 pt-12 text-center sm:pb-16 sm:pt-16">
    {restaurant.image && (
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="mb-4 h-20 w-20 rounded-2xl border-2 border-[#D9C69A]/70 object-cover shadow-xl"
      />
    )}

    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#E6C87A]">
      Welcome to
    </p>

    <h1 className="mt-3 text-3xl font-semibold tracking-wide text-white drop-shadow-lg sm:text-5xl">
      {restaurant.name}
    </h1>

    <div className="mt-3 h-px w-16 bg-[#D9C69A]" />

    <p className="mt-3 max-w-xl text-xs leading-6 text-white/85 sm:text-sm">
      {restaurant.address}
      {restaurant.city ? `, ${restaurant.city}` : ""}
    </p>

    <div className="mt-6 flex items-center gap-2 rounded-full border border-[#D9C69A]/50 bg-black/30 px-5 py-2.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
      <span className="h-2 w-2 rounded-full bg-[#E6C87A]" />
      Table {table.tableNumber}
    </div>
  </div>
</header>

      {/* Sticky navigation and cart */}
      <div className="sticky top-0 z-30 border-b border-[#EAE5DA] bg-[#F7F5EF]/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <button
            onClick={() => {
              setCurrentView("categories");
              setActiveCategory(null);
              setCategorySearch("");
              setItemSearch("");
            }}
            className="text-left"
          >
            <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#9A8353]">
              Explore
            </span>
            <span className="text-sm font-semibold text-[#26372D]">
              Our Menu
            </span>
          </button>

          <button
            onClick={() => setCurrentView("cart")}
          className="relative ml-auto flex items-center gap-2 rounded-full bg-[#17392D] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#17392D]/15 transition hover:bg-[#28533F]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            Cart

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D9C69A] px-1 text-[10px] font-extrabold text-[#17392D]">
              {cartCount}
            </span>
          </button>

          {authenticatedCustomer && (
  <div className="relative">
    <button
      onClick={() =>
        setShowCustomerDropdown((prev) => !prev)
      }
      className="flex items-center gap-2 rounded-full border border-[#D8D2C4] bg-white px-3 py-2.5 text-xs font-semibold text-[#17392D] shadow-sm transition hover:bg-[#F2F0E9]"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#17392D] text-xs font-bold text-white">
        {authenticatedCustomer.name?.charAt(0)?.toUpperCase()}
      </span>

      <span className="max-w-[90px] truncate">
        {authenticatedCustomer.name?.split(" ")[0]}
      </span>

      <svg
        className={`h-3 w-3 transition-transform ${
          showCustomerDropdown ? "rotate-180" : ""
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.09 1.04l-4.25 4.5a.75.75 0 01-1.09 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>

    {showCustomerDropdown && (
      <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white shadow-xl">
        <div className="border-b border-[#EEEAE1] bg-[#F7F5EF] px-4 py-4">
          <p className="text-sm font-bold text-[#20372A]">
            {authenticatedCustomer.name}
          </p>
          <p className="mt-1 text-xs text-[#7B837C]">
            {authenticatedCustomer.email}
          </p>
          <p className="mt-1 text-xs text-[#7B837C]">
            {authenticatedCustomer.mobile}
          </p>
        </div>

        <div className="p-2">
          <button
onClick={() => {
  setShowCustomerDropdown(false);
  setProfileModalView("profile");
  setShowProfileModal(true);
}}
            className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-[#26372D] transition hover:bg-[#F5F4EF]"
          >
            My Profile
          </button>

          <button
onClick={() => {
  setShowCustomerDropdown(false);
setProfileModalView("orders");
  setShowProfileModal(true);
}}
            className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-[#26372D] transition hover:bg-[#F5F4EF]"
          >
            My Orders
          </button>

          <button
            onClick={async () => {
              setShowCustomerDropdown(false);

              try {
                const response = await fetch(
                  "/api/public/customers/logout",
                  { method: "POST" }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                  throw new Error(data.message || "Logout failed.");
                }

                setAuthenticatedCustomer(null);
                setShowProfileModal(false);
              } catch (error) {
                console.error("Customer logout error:", error);
                alert(error.message || "Unable to logout.");
              }
            }}
            className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    )}
  </div>
)}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-7 sm:pt-10 lg:px-10">
        {/* Category home */}
        {currentView === "categories" && (
          <section>

<div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#17392D] px-6 py-9 text-white shadow-[0_18px_45px_rgba(23,57,45,0.12)] sm:px-9 sm:py-11 lg:px-12">
  {/* Decorative background */}
  <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-[#D9C69A]/20" />
  <div className="pointer-events-none absolute -right-2 -top-16 h-52 w-52 rounded-full border border-[#D9C69A]/15" />

  <div className="relative z-10 max-w-2xl">
    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E6C87A]">
      Made fresh for you · Dine-in menu
    </p>

    <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
      What are you craving today?
    </h2>

    <p className="mt-3 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
      Discover our kitchen favourites, freshly prepared for your table.
    </p>

    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D9C69A]/30 bg-white/10 px-4 py-2.5 text-xs font-medium text-white/90 backdrop-blur-sm">
      <span className="h-2 w-2 rounded-full bg-[#E6C87A]" />
      Serving at Table {table.tableNumber}
    </div>
  </div>

  {/* Decorative gold accent */}
  <div className="pointer-events-none absolute bottom-0 right-0 h-1 w-1/3 rounded-full bg-gradient-to-l from-[#D9C69A]/60 to-transparent" />
</div>


            
<div className="relative mb-8">
  <svg
    viewBox="0 0 24 24"
    className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B18B50]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m16 16 4 4" strokeLinecap="round" />
  </svg>

  <input
    type="search"
    value={categorySearch}
    onChange={(e) => setCategorySearch(e.target.value)}
    placeholder="Search categories..."
    className="w-full rounded-2xl border border-[#E8E1D5] bg-white py-4 pl-14 pr-5 text-sm text-[#26372D] shadow-[0_4px_15px_rgba(23,57,45,0.04)] outline-none transition-all duration-200 placeholder:text-[#A2A79F] focus:border-[#B18B50] focus:ring-4 focus:ring-[#C9A24D]/10 focus:shadow-md"
  />
</div>


            {/* Most Popular Dishes */}
{recommendedItems.length > 0 && (
  <div className="mb-10">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B18B50]">
          Restaurant favourites
        </p>
        <h3 className="mt-1 text-xl font-semibold text-[#26372D]">
          Most Popular Dishes
        </h3>
      </div>
      <span className="text-xs text-[#929990]">
        Chef recommended
      </span>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

{recommendedItems.slice(0, 3).map((item) => (
  <div
    key={item._id}
    className="group overflow-hidden rounded-[1.5rem] border border-[#E8E1D5] bg-white shadow-[0_8px_28px_rgba(34,48,38,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24D]/50 hover:shadow-[0_16px_35px_rgba(34,48,38,0.10)]"
  >
    <div className="relative h-44 overflow-hidden bg-[#F1EEE7]">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#F5F2EC] to-[#EAE4D8]">
          <UtensilsCrossed
            size={42}
            strokeWidth={1.4}
            className="text-[#B18B50]"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#10271F]/35 to-transparent" />

      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[#E6C87A]/40 bg-[#17392D]/95 px-3 py-1.5 text-[10px] font-semibold text-[#F5E4BB] shadow-sm backdrop-blur-sm">
        <span className="text-[#E6C87A]">★</span>
        Recommended
      </span>
    </div>

    <div className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[15px] font-semibold tracking-tight text-[#26372D]">
            {item.name}
          </h4>

          <p className="mt-1 text-xs text-[#929990]">
            {item.categoryName}
          </p>
        </div>

        <span className="whitespace-nowrap rounded-lg bg-[#F5F2EC] px-2.5 py-1.5 text-sm font-bold text-[#31513D]">
          ₹{item.price}
        </span>
      </div>

      {item.description && (
        <p className="mt-2 line-clamp-2 min-h-9 text-xs leading-5 text-[#929990]">
          {item.description}
        </p>
      )}

      <button
        onClick={() => addToCart(item)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17392D] py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#24513E] hover:shadow-md active:scale-[0.98]"
      >
        + Add to Cart
      </button>
    </div>
  </div>
))}

    </div>
  </div>
)}

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#26372D]">
                Browse by category
              </h3>

              <span className="text-xs text-[#929990]">
                {visibleCategories.length} categories
              </span>
            </div>

            {visibleCategories.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DCD7CC] bg-white p-10 text-center">
                <p className="font-semibold text-[#526158]">
                  No categories found
                </p>
                <p className="mt-1 text-sm text-[#929990]">
                  Try searching with another name.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

{visibleCategories.map((category, index) => (
  <button
    key={category._id}
    onClick={() => {
      setActiveCategory(category);
      setItemSearch("");
      setCurrentView("items");
    }}
    className="group overflow-hidden rounded-[1.75rem] border border-[#E8E1D5] bg-white text-left shadow-[0_8px_28px_rgba(34,48,38,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24D]/60 hover:shadow-[0_18px_42px_rgba(34,48,38,0.12)]"
  >
    <div className="relative aspect-[16/9] overflow-hidden bg-[#EDEAE2]">
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#F5F2EC] to-[#EAE4D8]">
          <UtensilsCrossed
            size={42}
            strokeWidth={1.4}
            className="text-[#B18B50]"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#10271F]/75 via-black/10 to-transparent" />

      <span className="absolute bottom-4 left-4 rounded-full border border-[#E6C87A]/40 bg-[#17392D]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#F5E4BB] backdrop-blur-sm">
        {category.items?.length || 0} Items
      </span>
    </div>

    <div className="flex min-h-[88px] items-center justify-between gap-3 p-4 sm:p-5">
      <div className="min-w-0">
        <h4 className="text-base font-semibold tracking-tight text-[#26372D] transition-colors group-hover:text-[#98743D]">
          {category.name}
        </h4>

        {category.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#929990]">
            {category.description}
          </p>
        )}
      </div>

      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E1D5] bg-[#F5F2EC] text-[#98743D] transition-all duration-300 group-hover:border-[#17392D] group-hover:bg-[#17392D] group-hover:text-[#E6C87A]">
        <ArrowUpRight size={19} strokeWidth={1.7} />
      </span>
    </div>
  </button>
))}

              </div>
            )}
          </section>
        )}

        {/* Category items */}
        {currentView === "items" && activeCategory && (
          <section>
            <button
              onClick={() => {
                setCurrentView("categories");
                setActiveCategory(null);
                setItemSearch("");
              }}
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#66736B] transition hover:text-[#17392D]"
            >
              <span className="text-lg">←</span>
              All categories
            </button>

            <div className="mb-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9A8353]">
                Explore category
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#26372D] sm:text-3xl">
                {activeCategory.name}
              </h2>

              {activeCategory.description && (
                <p className="mt-2 text-sm text-[#818980]">
                  {activeCategory.description}
                </p>
              )}
            </div>

            <div className="relative mb-7">
              <svg
                viewBox="0 0 24 24"
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#929990]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" strokeLinecap="round" />
              </svg>

              <input
                type="search"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                placeholder={`Search in ${activeCategory.name}...`}
                className="w-full rounded-2xl border border-[#E8E3D9] bg-white py-4 pl-12 pr-4 text-sm outline-none transition placeholder:text-[#A2A79F] focus:border-[#9BAE9F] focus:ring-4 focus:ring-[#1B3A2F]/5"
              />
            </div>

            {visibleItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DCD7CC] bg-white p-10 text-center">
                <p className="font-semibold text-[#526158]">
                  No food items found
                </p>
                <p className="mt-1 text-sm text-[#929990]">
                  Please try another search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((item) => (
                  <article
                    key={item._id}
                    className="group overflow-hidden rounded-3xl border border-[#EAE5DA] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[5/3] overflow-hidden bg-[#EDEAE2]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-[#A4AA9F]">
                          🍴
                        </div>
                      )}

                      {item.isRecommended && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#F6EBD3] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#8A6425] shadow-sm">
                          Chef's choice
                        </span>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border ${foodTypeClasses(item.foodType)}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            </span>

                            <span className="text-[10px] font-medium text-[#929990]">
                              {item.foodType || "Food"}
                            </span>
                          </div>

                          <h3 className="mt-2 text-base font-semibold text-[#26372D]">
                            {item.name}
                          </h3>
                        </div>

                        <p className="shrink-0 text-base font-bold text-[#244633]">
                          ₹{item.price}
                        </p>
                      </div>

                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#858D85]">
                          {item.description}
                        </p>
                      )}

                      {item.variants?.length > 0 && (
                        <div className="mt-4">
                          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#7D877E]">
                            Select size
                          </label>

                          <select
                            value={
                              selectedVariants[item._id] ||
                              item.variants[0].size
                            }
                            onChange={(e) =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [item._id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-[#E8E3D9] bg-[#FCFBF8] px-3 py-2.5 text-xs font-medium text-[#526158] outline-none focus:border-[#9BAE9F]"
                          >
                            {item.variants.map((variant, index) => (
                              <option key={index} value={variant.size}>
                                {variant.size} - {variant.quantity} (₹
                                {variant.price})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        onClick={() => addToCart(item)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#244633]/20 bg-[#EDF2EC] py-3 text-xs font-bold text-[#244633] transition hover:border-[#17392D] hover:bg-[#17392D] hover:text-white"
                      >
                        <span className="text-base leading-none">+</span>
                        Add to cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}


{/* Cart page */}
{currentView === "cart" && (
  <section className="pb-10">
    {/* Header */}
    <div className="mb-8">
      <button
        onClick={() => setCurrentView("categories")}
        className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-[#66736B] transition hover:text-[#17392D]"
      >
        <ArrowLeft size={15} />
        Continue browsing
      </button>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A4874D]">
            Your selection
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#17392D] sm:text-4xl">
            Your Cart
          </h2>

          <p className="mt-2 text-sm text-[#7D877E]">
            Review your favourites before placing your order.
          </p>
        </div>

        {cart.length > 0 && (
          <div className="hidden items-center gap-2 rounded-full border border-[#E8E1D5] bg-white px-4 py-2 sm:flex">
            <ShoppingBag size={15} className="text-[#A4874D]" />
            <span className="text-xs font-semibold text-[#17392D]">
              {cartCount} Items
            </span>
          </div>
        )}
      </div>
    </div>

    {cart.length === 0 ? (
      <div className="rounded-[28px] border border-[#E8E1D5] bg-white px-6 py-16 text-center shadow-[0_12px_35px_rgba(34,48,38,0.04)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F3F2EA] text-[#A4874D]">
          <ShoppingBag size={34} strokeWidth={1.4} />
        </div>

        <h3 className="mt-6 text-xl font-semibold text-[#17392D]">
          Your cart is empty
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#929990]">
          Looks like you haven't added anything yet. Explore our menu and discover something delicious.
        </p>

        <button
          onClick={() => setCurrentView("categories")}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#17392D] px-7 py-3.5 text-xs font-bold text-white transition hover:bg-[#28533F]"
        >
          Explore Menu
          <ArrowUpRight size={15} />
        </button>
      </div>
    ) : (
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">

        {/* Cart Items */}
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#17392D]">
              Selected Items
            </h3>
            <span className="text-[11px] text-[#929990]">
              {cartCount} items
            </span>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartKey}
                className="group rounded-[24px] border border-[#EAE5DA] bg-white p-4 shadow-[0_5px_20px_rgba(34,48,38,0.035)] transition hover:border-[#D8CFBC] sm:p-5"
              >
                <div className="flex gap-4 sm:gap-5">
                  {/* Product Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F0EEE7] sm:h-28 sm:w-28">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#A4AA9F]">
                        <UtensilsCrossed size={28} strokeWidth={1.3} />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold leading-5 text-[#26372D] sm:text-base">
                        {item.name}
                      </h3>

                      {item.selectedSize && (
                        <p className="mt-1.5 text-[11px] text-[#929990]">
                          {item.selectedSize} - {item.selectedQuantity}
                        </p>
                      )}

                      <p className="mt-2 text-xs font-medium text-[#A4874D]">
                        ₹{item.price} <span className="text-[#929990]">/ item</span>
                      </p>

                      <button
                        onClick={() => updateQuantity(item.cartKey, -item.quantity)}
                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#A16A62] transition hover:text-red-700"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-3 rounded-full border border-[#E8E3D9] bg-[#FAF9F6] px-2 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.cartKey, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#526158] transition hover:bg-[#EAEDE5]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="min-w-4 text-center text-xs font-bold tabular-nums text-[#17392D]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.cartKey, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#526158] transition hover:bg-[#EAEDE5]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <p className="text-sm font-bold tabular-nums text-[#17392D] sm:text-base">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentView("categories")}
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#66736B] transition hover:text-[#17392D]"
          >
            <ArrowLeft size={14} />
            Add more items
          </button>
        </div>

        {/* Order Summary */}
        <aside className="h-fit min-w-0 overflow-hidden rounded-[26px] border border-[#E8E1D5] bg-white shadow-[0_12px_35px_rgba(34,48,38,0.07)] lg:sticky lg:top-24">
          <div className="bg-[#17392D] px-6 py-6 text-white">
            <div className="flex items-center gap-2 text-[#E6C87A]">
              <ReceiptText size={16} />
              <p className="text-[10px] font-bold uppercase tracking-[0.24em]">
                Order Details
              </p>
            </div>

            <h3 className="mt-2 text-xl font-semibold">
              Order Summary
            </h3>

            <p className="mt-1 text-xs text-white/60">
              A little something delicious awaits.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between rounded-2xl bg-[#F7F5F0] px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={16} className="text-[#A4874D]" />
                <span className="text-xs font-medium text-[#69756C]">
                  Items in your cart
                </span>
              </div>

              <span className="text-sm font-bold text-[#17392D]">
                {cartCount}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7D877E]">Subtotal</span>
                <span className="font-semibold text-[#26372D]">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            <div className="my-5 border-t border-dashed border-[#E3DED3]" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#26372D]">
                Total Amount
              </span>

              <span className="text-2xl font-bold tracking-tight text-[#17392D]">
                ₹{cartTotal}
              </span>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-[#929990]">
              Taxes or additional charges, if applicable, will be confirmed by the restaurant.
            </p>

            <button
              onClick={() => {
                if (authenticatedCustomer) {
                  placeOrder();
                  return;
                }

                const cartKey = `customer_cart_${restaurantId}_${tableId}`;

                sessionStorage.setItem(cartKey, JSON.stringify(cart));

                const returnTo = `/menu?restaurantId=${encodeURIComponent(
                  restaurantId
                )}&tableId=${encodeURIComponent(tableId)}`;

                window.location.href = `/customer/login?returnTo=${encodeURIComponent(
                  returnTo
                )}`;
              }}
              disabled={orderLoading || customerSessionLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17392D] py-4 text-sm font-bold text-white shadow-lg shadow-[#17392D]/15 transition-all duration-300 hover:bg-[#28533F] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {customerSessionLoading
                ? "Checking customer..."
                : orderLoading
                ? "Placing order..."
                : "Place Order"}
              {!customerSessionLoading && !orderLoading && (
                <ArrowUpRight size={16} />
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A4874D]" />
              <p className="text-[10px] text-[#929990]">
                Freshly prepared with care
              </p>
            </div>
          </div>
        </aside>
      </div>
    )}
  </section>
)}

      </div>

      {/* Sticky cart summary - presentation only; uses the existing cart state and navigation */}
      {cartCount > 0 && currentView !== "cart" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E0D4] bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(25,48,37,0.10)] backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#718075]">{cartCount} {cartCount === 1 ? "item" : "items"} in your cart</p>
              <p className="mt-0.5 text-lg font-bold text-[#17392D]">₹{cartTotal}</p>
            </div>
            <button
              onClick={() => setCurrentView("cart")}
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#17392D] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#17392D]/15 transition hover:bg-[#28533F]"
            >
              View Cart <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Customer details modal - existing registration/order flow retained */}


      {/* Customer profile and order history retained */}
      {showProfileModal && authenticatedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101A14]/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#FCFBF8] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9A8353]">
                  Your account
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-[#20372A]">
                  My profile
                </h2>
              </div>

              <button
                onClick={() => setShowProfileModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EFE9] text-xl text-[#526158]"
              >
                ×
              </button>
            </div>

            {profileModalView === "profile" && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#929990]">Full name</p>
                <p className="mt-1 font-semibold text-[#26372D]">
                  {authenticatedCustomer.name}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#929990]">Mobile number</p>
                <p className="mt-1 font-semibold text-[#26372D]">
                  {authenticatedCustomer.mobile}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 sm:col-span-2">
                <p className="text-xs text-[#929990]">Email address</p>
                <p className="mt-1 font-semibold text-[#26372D]">
                  {authenticatedCustomer.email || "Not provided"}
                </p>
              </div>
            </div>
             )}

             {profileModalView === "orders" && (
            <div className="mt-7 border-t border-[#E8E3D9] pt-6">
              <h3 className="text-lg font-semibold text-[#26372D]">
                My order history
              </h3>

              {ordersLoading ? (
                <p className="mt-4 text-sm text-[#7B837C]">
                  Loading your orders...
                </p>
              ) : ordersError ? (
                <p className="mt-4 text-sm text-rose-600">
                  {ordersError}
                </p>
              ) : customerOrders.length === 0 ? (
                <p className="mt-4 text-sm text-[#929990]">
                  You haven't placed any orders yet.
                </p>
              ) : (
                <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
                  {customerOrders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-[#E8E3D9] bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#244633]">
                          {order.orderNumber}
                        </p>

                        <span className="rounded-full bg-[#EDF3ED] px-3 py-1 text-[10px] font-semibold text-[#426B4B]">
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-2 text-[10px] text-[#929990]">
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>

                      <div className="mt-3 space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex justify-between gap-3 text-xs"
                          >
                            <span className="text-[#68736A]">
                              {item.name} × {item.quantity}
                              {item.selectedSize
                                ? ` (${item.selectedSize})`
                                : ""}
                            </span>

                            <span className="font-semibold text-[#26372D]">
                              ₹{item.total}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex justify-between border-t border-[#EEEAE2] pt-3 text-sm">
                        <span className="font-semibold text-[#68736A]">
                          Total amount
                        </span>

                        <span className="font-bold text-[#244633]">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      <p className="mt-2 text-[10px] text-[#929990]">
                        Payment: {order.paymentStatus}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-6 w-full rounded-xl bg-[#17392D] py-3 text-sm font-bold text-white hover:bg-[#28533F]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {orderMessage && (
        <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-[#D6E4D8] bg-white px-5 py-4 text-center text-sm font-semibold text-[#315D3B] shadow-xl">
          {orderMessage}

          <button
            onClick={() => setOrderMessage("")}
            className="ml-3 text-[#7B837C]"
          >
            ×
          </button>
        </div>
      )}

      <footer className="mt-10 border-t border-[#E7E1D6] px-5 py-7 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9A8353]">
          Thank you
        </p>

        <p className="mt-1 text-xs text-[#8A928B]">
          We hope you enjoy your dining experience.
        </p>
      </footer>
    </main>
  );
}

export default function PublicMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DCE5DE] border-t-[#1B3A2F]" />
            <p className="mt-4 text-sm font-medium text-[#66736B]">
              Preparing your menu...
            </p>
          </div>
        </div>
      }
    >
      <PublicMenuContent />
    </Suspense>
  );
}