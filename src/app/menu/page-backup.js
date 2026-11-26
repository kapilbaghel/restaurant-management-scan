
// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// export default function PublicMenuPage() {
//   const searchParams = useSearchParams();

//   const restaurantId = searchParams.get("restaurantId");
//   const tableId = searchParams.get("tableId");
//   const [menuData, setMenuData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [cart, setCart] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
// const [orderLoading, setOrderLoading] = useState(false);
// const [orderMessage, setOrderMessage] = useState("");

// const [showCustomerModal, setShowCustomerModal] = useState(false);
// const [customer, setCustomer] = useState({
//   name: "",
//   mobile: "",
//   email: "",
// });

// const [showProfileModal, setShowProfileModal] = useState(false);
// const [customerOrders, setCustomerOrders] = useState([]);
// const [ordersLoading, setOrdersLoading] = useState(false);
// const [ordersError, setOrdersError] = useState("");

// const [authenticatedCustomer, setAuthenticatedCustomer] = useState(null);
// const [customerSessionLoading, setCustomerSessionLoading] = useState(true);




// const addToCart = (item) => {
//   const selectedSize = selectedVariants[item._id];

//   const selectedVariant = item.variants?.length > 0
//     ? item.variants.find(
//         (variant) =>
//           variant.size === (selectedSize || item.variants[0].size)
//       )
//     : null;

//   const cartItem = {
//     ...item,
//     price: selectedVariant ? selectedVariant.price : item.price,
//     selectedSize: selectedVariant ? selectedVariant.size : "",
//     selectedQuantity: selectedVariant ? selectedVariant.quantity : "",
//   };

//   const cartKey = `${item._id}-${cartItem.selectedSize}`;

//   setCart((prevCart) => {
//     // Same menu item ki sabhi sizes ki total quantity
//     const totalItemQuantity = prevCart
//       .filter((cartItem) => cartItem._id === item._id)
//       .reduce((total, cartItem) => total + cartItem.quantity, 0);

//     // Maximum 50 quantity per menu item
// const lassiItemNames = [
//   "Mango Lassi",
//   "Sweet Lassi",
//   "Masala Chaas",
// ];

// if (
//   lassiItemNames.includes(item.name.trim()) &&
//   totalItemQuantity >= 50
// ) {
//   alert(`Maximum 50 quantity allowed for ${item.name}.`);
//   return prevCart;
// }

//     const existingItem = prevCart.find(
//       (cartItem) => cartItem.cartKey === cartKey
//     );

//     if (existingItem) {
//       return prevCart.map((cartItem) =>
//         cartItem.cartKey === cartKey
//           ? { ...cartItem, quantity: cartItem.quantity + 1 }
//           : cartItem
//       );
//     }

//     return [
//       ...prevCart,
//       {
//         ...cartItem,
//         cartKey,
//         quantity: 1,
//       },
//     ];
//   });
// };


// const updateQuantity = (cartKey, change) => {
//   setCart((prevCart) => {
//     const currentItem = prevCart.find(
//       (item) => item.cartKey === cartKey
//     );

//     if (!currentItem) return prevCart;

//     // Same menu item ke sabhi sizes ki total quantity
//     const totalItemQuantity = prevCart
//       .filter((item) => item._id === currentItem._id)
//       .reduce((total, item) => total + item.quantity, 0);

//     // Maximum 50 quantity per menu item
// const lassiItemNames = [
//   "Mango Lassi",
//   "Sweet Lassi",
//   "Masala Chaas",
// ];

// if (
//   change > 0 &&
//   lassiItemNames.includes(currentItem.name.trim()) &&
//   totalItemQuantity >= 50
// ) {
//   alert(`Maximum 50 quantity allowed for ${currentItem.name}.`);
//   return prevCart;
// }

//     return prevCart
//       .map((item) =>
//         item.cartKey === cartKey
//           ? { ...item, quantity: item.quantity + change }
//           : item
//       )
//       .filter((item) => item.quantity > 0);
//   });
// };


// const placeOrder = async (customerId) => {
//   if (cart.length === 0) {
//     setOrderMessage("Your cart is empty.");
//     return;
//   }

//   try {
//     setOrderLoading(true);
//     setOrderMessage("");

//     const response = await fetch("/api/public/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         restaurantId,
//         tableId,
//         customerId,
// items: cart.map((item) => ({
//   menuItemId: item._id,
//   quantity: item.quantity,
//   selectedSize: item.selectedSize,
//   selectedQuantity: item.selectedQuantity,
// })),
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok || !data.success) {
//       throw new Error(data.message || "Unable to place order.");
//     }

//     setOrderMessage(
//       `Order placed successfully! Order No: ${data.order.orderNumber}`
//     );

//     setCart([]);
//   } catch (err) {
//     setOrderMessage(err.message);
//   } finally {
//     setOrderLoading(false);
//   }
// };

//   useEffect(() => {
//     async function fetchMenu() {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await fetch(
//           `/api/public/menu?restaurantId=${restaurantId}&tableId=${tableId}`
//         );

//         const data = await response.json();

//         if (!response.ok || !data.success) {
//           throw new Error(data.message || "Unable to load menu.");
//         }

//         setMenuData(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (restaurantId && tableId) {
//       fetchMenu();
//     } else {
//       setError("Restaurant or Table information is missing.");
//       setLoading(false);
//     }
//   }, [restaurantId, tableId]);

//   useEffect(() => {
//   const checkCustomerSession = async () => {
//     if (!restaurantId) {
//       setCustomerSessionLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `/api/public/customers/session?restaurantId=${restaurantId}`,
//         {
//           method: "GET",
//           cache: "no-store",
//         }
//       );

//       const data = await response.json();

//       if (data.success && data.authenticated && data.customer) {
//         setAuthenticatedCustomer(data.customer);

// setCustomer({
//   name: data.customer.name || "",
//   mobile: data.customer.mobile || "",
//   email: data.customer.email || "",
// });
//       }
//     } catch (error) {
//       console.error("Customer session error:", error);
//     } finally {
//       setCustomerSessionLoading(false);
//     }
//   };

//   checkCustomerSession();
// }, [restaurantId]);



// useEffect(() => {
//   const fetchCustomerOrders = async () => {
//     if (!showProfileModal || !authenticatedCustomer || !restaurantId) {
//       return;
//     }

//     setOrdersLoading(true);
//     setOrdersError("");

//     try {
//       const response = await fetch(
//         `/api/public/customers/orders?restaurantId=${restaurantId}`,
//         {
//           method: "GET",
//           cache: "no-store",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         setOrdersError(
//           data.message || "Unable to load order history."
//         );
//         setCustomerOrders([]);
//         return;
//       }

//       setCustomerOrders(data.orders || []);
//     } catch (error) {
//       console.error("Fetch Customer Orders Error:", error);
//       setOrdersError("Something went wrong while loading orders.");
//       setCustomerOrders([]);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   fetchCustomerOrders();
// }, [showProfileModal, authenticatedCustomer, restaurantId]);


//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE]">
//         <p className="text-gray-600">Loading Menu...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE] p-6">
//         <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
//           <h2 className="text-xl font-bold text-gray-800">
//             Unable to Load Menu
//           </h2>
//           <p className="mt-3 text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   const { restaurant, table, categories } = menuData;

//   return (
//     <main className="min-h-screen bg-[#F7F4EE]">
//       {/* Restaurant Header */}
//       <header className="bg-[#1B3A2F] px-5 py-10 text-center text-white">
//         {restaurant.image && (
//           <img
//             src={restaurant.image}
//             alt={restaurant.name}
//             className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
//           />
//         )}

//         <h1 className="text-3xl font-bold">
//           {restaurant.name}
//         </h1>

//         <p className="mt-2 text-sm text-gray-200">
//           {restaurant.address}
//           {restaurant.city ? `, ${restaurant.city}` : ""}
//         </p>

//         <div className="mt-5 inline-block rounded-full bg-white/10 px-5 py-2 text-sm">
//           Table {table.tableNumber}
//         </div>

//         {authenticatedCustomer && (
//   <button
//     onClick={() => setShowProfileModal(true)}
//     className="mt-5 rounded-full border border-white/40 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-[#1B3A2F]"
//   >
//     My Profile
//   </button>
// )}

//       </header>

//       {/* Menu Section */}
//       <section className="mx-auto max-w-6xl px-5 py-10">
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-[#2B2926]">
//             Our Menu
//           </h2>
//           <p className="mt-2 text-gray-500">
//             Explore our delicious selection.
//           </p>
//         </div>

//         {categories.length === 0 ? (
//           <p className="rounded-xl bg-white p-6 text-center text-gray-500">
//             No menu categories available.
//           </p>
//         ) : (
//           <div className="space-y-10">
//             {categories.map((category) => (
//               <div key={category._id}>
//                 <div className="mb-5 border-b border-[#E5DDD1] pb-3">
//                   <h3 className="text-xl font-bold text-[#1B3A2F]">
//                     {category.name}
//                   </h3>

//                   {category.description && (
//                     <p className="mt-1 text-sm text-gray-500">
//                       {category.description}
//                     </p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//                   {category.items.map((item) => (
//                     <div
//                       key={item._id}
//                       className="overflow-hidden rounded-2xl bg-white shadow-sm"
//                     >
//                       {item.image ? (
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="h-48 w-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-48 items-center justify-center bg-[#EDE8DF] text-gray-400">
//                           No Image
//                         </div>
//                       )}

//                       <div className="p-5">
//                         <div className="flex items-center justify-between gap-3">
//                           <h4 className="font-semibold text-[#2B2926]">
//                             {item.name}
//                           </h4>

//                           <span className="whitespace-nowrap text-sm font-bold text-[#1B3A2F]">
//                             ₹{item.price}
//                           </span>
//                         </div>

//                         {/* Size Selection */}
// {item.variants?.length > 0 && (
//   <div className="mt-4">
//     <label className="mb-2 block text-sm font-medium text-gray-700">
//       Select Size
//     </label>

//     <select
//       value={
//         selectedVariants[item._id] ||
//         item.variants[0].size
//       }
//       onChange={(e) =>
//         setSelectedVariants((prev) => ({
//           ...prev,
//           [item._id]: e.target.value,
//         }))
//       }
//       className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none"
//     >
//       {item.variants.map((variant, index) => (
//         <option key={index} value={variant.size}>
//           {variant.size} - {variant.quantity} (₹{variant.price})
//         </option>
//       ))}
//     </select>
//   </div>
// )}

//                         <div className="mt-2 flex items-center gap-2">
//                           <span
//                             className={`h-3 w-3 rounded-sm border ${
//                               item.foodType === "Veg"
//                                 ? "border-green-600"
//                                 : item.foodType === "Egg"
//                                 ? "border-yellow-500"
//                                 : "border-red-600"
//                             }`}
//                           >
//                             <span
//                               className={`m-[2px] block h-1.5 w-1.5 rounded-full ${
//                                 item.foodType === "Veg"
//                                   ? "bg-green-600"
//                                   : item.foodType === "Egg"
//                                   ? "bg-yellow-500"
//                                   : "bg-red-600"
//                               }`}
//                             />
//                           </span>

//                           <span className="text-xs text-gray-500">
//                             {item.foodType}
//                           </span>

//                           {item.isRecommended && (
//                             <span className="ml-auto rounded-full bg-[#F8EED7] px-2 py-1 text-xs text-[#8A6425]">
//                               Recommended
//                             </span>
//                           )}
//                         </div>

//                         {item.description && (
//                           <p className="mt-3 text-sm leading-6 text-gray-500">
//                             {item.description}
//                           </p>
//                         )}

// <button
//   onClick={() => addToCart(item)}
//   className="mt-4 w-full rounded-lg bg-[#1B3A2F] py-3 text-sm font-semibold text-white transition hover:bg-[#0E4F3A]"
// >
//   + Add to Cart
// </button>

//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>


// {/* Cart Summary */}
// {cart.length > 0 && (
//   <section className="mx-auto mb-10 max-w-6xl px-5">
//     <div className="rounded-2xl bg-white p-6 shadow-sm">
//       <h2 className="mb-5 text-xl font-bold text-[#1B3A2F]">
//         Your Cart ({cart.length} Items)
//       </h2>

//       <div className="space-y-4">
//         {cart.map((item) => (
//           <div
//           key={item.cartKey}
//             className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4"
//           >
//             <div>
//               <h3 className="font-semibold text-gray-800">
//                 {item.name}
//               </h3>

// <div className="mt-2 flex items-center gap-3">
//   <button
//     onClick={() => updateQuantity(item.cartKey, -1)}
//     className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-lg font-bold"
//   >
//     −
//   </button>

//   <span className="font-semibold">
//     {item.quantity}
//   </span>

//   <button
//    onClick={() => updateQuantity(item.cartKey, 1)}
//     className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-lg font-bold"
//   >
//     +
//   </button>

//   <span className="ml-2 text-sm text-gray-500">
//     ₹{item.price} each
//   </span>
// </div>

//             </div>

//             <p className="font-semibold text-[#1B3A2F]">
//               ₹{item.price * item.quantity}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="mt-5 flex items-center justify-between">
//         <span className="text-lg font-bold">Total Amount</span>

//         <span className="text-xl font-bold text-[#1B3A2F]">
//           ₹{cart.reduce(
//             (total, item) => total + item.price * item.quantity,
//             0
//           )}
//         </span>
//       </div>

// {/* Place Order Button */}


// {/* Customer Details Popup */}

// {showCustomerModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//     <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

//       <h2 className="text-xl font-bold text-[#1B3A2F]">
//         Customer Details
//       </h2>

//       <p className="mt-2 text-sm text-gray-500">
//         Please enter your details to place your order.
//       </p>

//       <div className="mt-5 space-y-3">

//         <input
//           type="text"
//           placeholder="Full Name *"
//           value={customer.name}
//           onChange={(e) =>
//             setCustomer((prev) => ({
//               ...prev,
//               name: e.target.value,
//             }))
//           }
//           className="w-full rounded-lg border p-3 outline-none"
//         />

//         <input
//           type="tel"
//           placeholder="Mobile Number *"
//           value={customer.mobile}
//           maxLength={10}
//           onChange={(e) =>
//             setCustomer((prev) => ({
//               ...prev,
//               mobile: e.target.value.replace(/\D/g, ""),
//             }))
//           }
//           className="w-full rounded-lg border p-3 outline-none"
//         />

//         <input
//           type="email"
//           placeholder="Email Address (Optional)"
//           value={customer.email}
//           onChange={(e) =>
//             setCustomer((prev) => ({
//               ...prev,
//               email: e.target.value,
//             }))
//           }
//           className="w-full rounded-lg border p-3 outline-none"
//         />

//       </div>

//       <button
//         onClick={() => setShowCustomerModal(false)}
//         disabled={orderLoading}
//         className="mt-5 w-full rounded-lg border py-3 font-semibold text-gray-600"
//       >
//         Cancel
//       </button>

//       <button
//         type="button"
//         disabled={orderLoading}
//         onClick={async () => {
//           if (!customer.name.trim()) {
//             alert("Please enter your name.");
//             return;
//           }

//           if (!/^[6-9]\d{9}$/.test(customer.mobile)) {
//             alert("Please enter a valid 10-digit mobile number.");
//             return;
//           }

//           try {
//             setOrderLoading(true);
//             setOrderMessage("");

//             const response = await fetch("/api/public/customers", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 restaurantId,
//                 name: customer.name.trim(),
//                 mobile: customer.mobile,
//                 email: customer.email.trim(),
//               }),
//             });

//             const data = await response.json();

//             if (!response.ok || !data.success) {
//               throw new Error(
//                 data.message || "Unable to save customer details."
//               );
//             }

//             setAuthenticatedCustomer(data.customer);
//             setCustomer(data.customer);
//             setShowCustomerModal(false);

//             await placeOrder(data.customer._id);

//           } catch (error) {
//             setOrderMessage(error.message);
//           } finally {
//             setOrderLoading(false);
//           }
//         }}
//         className="mt-3 w-full rounded-lg bg-[#1B3A2F] py-3 font-semibold text-white hover:bg-[#0E4F3A] disabled:opacity-50"
//       >
//       {orderLoading ? "Please Wait..." : "Login"}
//       </button>

//     </div>
//   </div>
// )}

// <button
// onClick={() => {
//   if (authenticatedCustomer) {
//     placeOrder(authenticatedCustomer._id);
//   } else {
//     setShowCustomerModal(true);
//   }
// }}
// disabled={orderLoading || customerSessionLoading}
//   className="mt-6 w-full rounded-xl bg-[#1B3A2F] py-4 font-semibold text-white transition hover:bg-[#0E4F3A] disabled:opacity-50"
// >
//  {customerSessionLoading
//   ? "Checking Customer..."
//   : orderLoading
//   ? "Placing Order..."
//   : "Place Order"}
// </button>
//     </div>
//   </section>
// )}


// {/* Customer Profile Popup */}
// {showProfileModal && authenticatedCustomer && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//     <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-bold text-[#1B3A2F]">
//           My Profile
//         </h2>

//         <button
//           onClick={() => setShowProfileModal(false)}
//           className="text-2xl text-gray-500 hover:text-black"
//         >
//           &times;
//         </button>
//       </div>

//       <div className="mt-6 space-y-4">

//         <div>
//           <p className="text-sm text-gray-500">Full Name</p>
//           <p className="font-semibold text-gray-800">
//             {authenticatedCustomer.name}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">Mobile Number</p>
//           <p className="font-semibold text-gray-800">
//             {authenticatedCustomer.mobile}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">Email Address</p>
//           <p className="font-semibold text-gray-800">
//             {authenticatedCustomer.email || "Not provided"}
//           </p>
//         </div>


//       </div>

      
// {/* Order History */}
// <div className="mt-8 border-t border-gray-200 pt-6">
//   <h3 className="text-lg font-bold text-[#1B3A2F]">
//     My Order History
//   </h3>

//   {ordersLoading ? (
//     <p className="mt-4 text-sm text-gray-500">
//       Loading your orders...
//     </p>
//   ) : ordersError ? (
//     <p className="mt-4 text-sm text-red-500">
//       {ordersError}
//     </p>
//   ) : customerOrders.length === 0 ? (
//     <p className="mt-4 text-sm text-gray-500">
//       You haven't placed any orders yet.
//     </p>
//   ) : (
//     <div className="mt-4 max-h-80 space-y-4 overflow-y-auto">
//       {customerOrders.map((order) => (
//         <div
//           key={order._id}
//           className="rounded-xl border border-gray-200 p-4"
//         >
//           <div className="flex items-center justify-between gap-3">
//             <p className="font-semibold text-[#1B3A2F]">
//               {order.orderNumber}
//             </p>

//             <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
//               {order.status}
//             </span>
//           </div>

//           <p className="mt-2 text-xs text-gray-500">
//             {new Date(order.createdAt).toLocaleString("en-IN")}
//           </p>

//           <div className="mt-3 space-y-2">
//             {order.items.map((item, index) => (
//               <div
//                 key={`${order._id}-${index}`}
//                 className="flex justify-between gap-3 text-sm"
//               >
//                 <span className="text-gray-700">
//                   {item.name} × {item.quantity}
//                   {item.selectedSize && ` (${item.selectedSize})`}
//                 </span>

//                 <span className="font-medium text-gray-800">
//                   ₹{item.total}
//                 </span>
//               </div>
//             ))}
//           </div>

//           <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">
//             <span className="font-semibold text-gray-700">
//               Total Amount
//             </span>

//             <span className="font-bold text-[#1B3A2F]">
//               ₹{order.totalAmount}
//             </span>
//           </div>

//           <p className="mt-2 text-xs text-gray-500">
//             Payment: {order.paymentStatus}
//           </p>
//         </div>
//       ))}
//     </div>
//   )}
// </div>


//       <button
//         onClick={() => setShowProfileModal(false)}
//         className="mt-7 w-full rounded-lg bg-[#1B3A2F] py-3 font-semibold text-white hover:bg-[#0E4F3A]"
//       >
//         Close
//       </button>

//     </div>
//   </div>
// )}

// {/* Order Confirmation Message */}
// {orderMessage && (
//   <div className="mx-auto mb-8 max-w-6xl px-5">
//     <div className="rounded-xl bg-green-50 p-5 text-center font-semibold text-green-800">
//       {orderMessage}
//     </div>
//   </div>
// )}

//       <footer className="border-t border-[#E5DDD1] py-6 text-center text-sm text-gray-500">
//         Thank you for dining with us.
//       </footer>
//     </main>
//   );
// }
