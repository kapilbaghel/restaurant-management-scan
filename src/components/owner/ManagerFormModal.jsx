// "use client";

// import { X } from "lucide-react";

// export default function ManagerFormModal({
//   isOpen,
//   onClose,
//   restaurant,
// }) {
//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-xl">

//         {/* HEADER */}
//         <div className="flex items-start justify-between border-b border-[#EEE8DF] px-7 py-5">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B88945]">
//               Restaurant Management
//             </p>

//             <h2 className="mt-1 text-2xl font-bold text-[#171411]">
//               Create Manager
//             </h2>

//             <p className="mt-1 text-sm text-[#716B64]">
//               Add a manager for this restaurant.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-9 w-9 items-center justify-center rounded-lg text-[#716B64] transition hover:bg-[#F7F4EE] hover:text-[#171411]"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="max-h-[calc(90vh-100px)] overflow-y-auto px-7 py-6">

//           {/* RESTAURANT */}
//           <div className="mb-6 rounded-xl border border-[#E5DED4] bg-[#FCFAF7] p-4">
//             <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9289]">
//               Restaurant
//             </p>

//             <p className="mt-1 text-sm font-bold text-[#171411]">
//               {restaurant?.name || "Restaurant"}
//             </p>

//             <p className="mt-1 text-xs text-[#716B64]">
//               {restaurant?.city || restaurant?.location || "Location"}
//             </p>
//           </div>

//           {/* TEMPORARY */}
//           <div className="rounded-xl border border-dashed border-[#D5A960] p-8 text-center">
//             <p className="text-sm font-semibold text-[#171411]">
//               Manager Form
//             </p>

//             <p className="mt-1 text-sm text-[#716B64]">
//               Existing manager form yahan aayega.
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }