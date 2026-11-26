
"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import OwnerSidebar from "@/components/owner/OwnerSidebar";

export default function OwnerMenuPage() {

  const [activeTab, setActiveTab] = useState("items");

  const [expandedItemId, setExpandedItemId] = useState(null);
  const menuTableRef = useRef(null);

  const [menuItems, setMenuItems] = useState([]);
const [branchMenuItems, setBranchMenuItems] = useState([]);

const [showMenuItemModal, setShowMenuItemModal] = useState(false);
const [editingMenuItemId, setEditingMenuItemId] = useState(null);

const [itemName, setItemName] = useState("");
const [itemDescription, setItemDescription] = useState("");
const [itemCategory, setItemCategory] = useState("");
const [itemFoodType, setItemFoodType] = useState("Veg");
const [itemPrice, setItemPrice] = useState("");

const [itemVariants, setItemVariants] = useState([]);
const [useVariants, setUseVariants] = useState(false);

const [itemImage, setItemImage] = useState("");
const [uploadingImage, setUploadingImage] = useState(false);
const [imagePreview, setImagePreview] = useState("");
const [imageError, setImageError] = useState("");


const [itemRecommended, setItemRecommended] = useState(false);

  const [categories, setCategories] = useState([]);
    const [categoryRestaurantIds, setCategoryRestaurantIds] = useState([]);
const [itemRestaurantIds, setItemRestaurantIds] = useState([]);

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      menuTableRef.current &&
      !menuTableRef.current.contains(event.target)
    ) {
      setExpandedItemId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  useEffect(() => {
  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/owners/restaurants");
      const data = await response.json();
      console.log("SAVED CATEGORY FROM API:", data.category);
console.log("SAVED IMAGE URL:", data.category?.image);

      if (!response.ok) {
        alert(data.message || "Failed to load branches.");
        return;
      }

      setBranches(data.restaurants || []);
    } catch (error) {
      console.error("Fetch Branches Error:", error);
      alert("Something went wrong while loading branches.");
    }
  };

  fetchBranches();
}, []);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/owners/categories");
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load categories.");
        return;
      }

setCategories(
  data.categories.map((category) => ({
    id: category._id,
    name: category.name,
    description: category.description,
    image: category.image || "",
    restaurantIds: category.restaurantIds || [],
  }))
);
    } catch (error) {
      console.error("Fetch Categories Error:", error);
      alert("Something went wrong while loading categories.");
    }
  };

  fetchCategories();
}, []);

useEffect(() => {
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/owners/menu-items");
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load menu items.");
        return;
      }

      setMenuItems(
        data.menuItems.map((item) => ({
          ...item,
          id: item._id,
          categoryId: item.categoryId?._id || item.categoryId,
          categoryName: item.categoryId?.name || "Uncategorized",
          restaurantIds: item.restaurantIds || [],
        }))
      );
    } catch (error) {
      console.error("Fetch Menu Items Error:", error);
      alert("Something went wrong while loading menu items.");
    }
  };

  fetchMenuItems();
}, []);


useEffect(() => {
  const fetchBranchMenuItems = async () => {
    if (!selectedBranchId) {
      
      setBranchMenuItems([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/owners/menu-items?restaurantId=${selectedBranchId}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load branch menu.");
        return;
      }

console.log(
  "Branch Availability:",
  data.menuItems?.[0]?.branchAvailability
);

      setBranchMenuItems(
        (data.menuItems || []).map((item) => ({
          ...item,
          id: item._id,
          categoryId: item.categoryId?._id || item.categoryId,
          categoryName: item.categoryId?.name || "Uncategorized",
          restaurantIds: item.restaurantIds || [],
        }))
      );
    } catch (error) {
      console.error("Fetch Branch Menu Error:", error);
      alert("Something went wrong while loading branch menu.");
    }
  };

  fetchBranchMenuItems();
}, [selectedBranchId]);



const [categoryName, setCategoryName] = useState("");
const [categoryDescription, setCategoryDescription] = useState("");

const [categoryImage, setCategoryImage] = useState("");
const [categoryImagePreview, setCategoryImagePreview] = useState("");
const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
const [categoryImageError, setCategoryImageError] = useState("");

const [showCategoryModal, setShowCategoryModal] = useState(false);
const [editingCategoryId, setEditingCategoryId] = useState(null);



const handleToggleBranchAvailability = async (item) => {
  const currentBranchAvailability = (
    item.branchAvailability || []
  ).find(
    (branch) =>
      String(branch.restaurantId?._id || branch.restaurantId) ===
      String(selectedBranchId)
  );

  const currentStatus = currentBranchAvailability
    ? currentBranchAvailability.isAvailable
    : true;

    console.log("Current Branch Status:", currentStatus);

  const newStatus = !currentStatus;

  try {
    const response = await fetch(
      `/api/owners/menu-items/${item.id}/availability`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: selectedBranchId,
          isAvailable: newStatus,
        }),
      }
    );

    const data = await response.json();

    console.log("PATCH Response:", data);
console.log("New Status:", newStatus);

    if (!response.ok) {
      alert(data.message || "Failed to update availability.");
      return;
    }

    setBranchMenuItems((prev) =>
      prev.map((menuItem) =>
        menuItem.id === item.id
          ? {
              ...menuItem,
              branchAvailability: [
                ...(menuItem.branchAvailability || []).filter(
                  (branch) =>
                    String(
                      branch.restaurantId?._id || branch.restaurantId
                    ) !== String(selectedBranchId)
                ),
                {
                  restaurantId: selectedBranchId,
                  isAvailable: newStatus,
                },
              ],
            }
          : menuItem
      )
    );

  } catch (error) {
    console.error("Toggle Availability Error:", error);
    alert("Something went wrong while updating availability.");
  }
};


const handleEditCategory = (category) => {
  setEditingCategoryId(category.id);
  setCategoryName(category.name || "");
  setCategoryDescription(category.description || "");

  setCategoryImage(category.image || "");
setCategoryImagePreview(category.image || "");

  setCategoryRestaurantIds(
    (category.restaurantIds || []).map((branch) =>
      typeof branch === "string"
        ? branch
        : branch._id || branch.id
    )
  );

  setShowCategoryModal(true);
};

const handleSaveCategory = async () => {
  console.log("SAVE CATEGORY FUNCTION CALLED");

  if (uploadingCategoryImage) {
  alert("Please wait until the image upload is complete.");
  return;
}

if (!categoryImage) {
  alert("Please upload a category image.");
  return;
}

  if (!categoryName.trim()) {
    alert("Please enter category name.");
    return;
  }

  if (categoryRestaurantIds.length === 0) {
    alert("Please select at least one branch.");
    return;
  }

  const categoryExists = categories.some(
    (category) =>
      category.name.toLowerCase() ===
        categoryName.trim().toLowerCase() &&
      category.id !== editingCategoryId
  );

  if (categoryExists) {
    alert("Category already exists.");
    return;
  }

  try {
    const isEditing = editingCategoryId !== null;
    console.log("Category image before save:", categoryImage);

    const response = await fetch(
      isEditing
        ? `/api/owners/categories/${editingCategoryId}`
        : "/api/owners/categories",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
body: JSON.stringify({
  name: categoryName.trim(),
  description: categoryDescription.trim(),
  image: categoryImage,
  restaurantIds: categoryRestaurantIds,
}),
      }
    );

    const data = await response.json();
console.log("CATEGORY SAVE RESPONSE:", data);
console.log("CATEGORY IMAGE SAVED:", data.category?.image);
    if (!response.ok) {
      alert(data.message || "Failed to save category.");
      return;
    }

const savedCategory = {
  id: data.category._id,
  name: data.category.name,
  description: data.category.description,
  image: data.category.image || categoryImage,
  restaurantIds: categoryRestaurantIds,
};

    if (isEditing) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategoryId
            ? savedCategory
            : category
        )
      );
    } else {
      setCategories((prev) => [...prev, savedCategory]);
    }

    setCategoryName("");
    setCategoryDescription("");
    setCategoryRestaurantIds([]);
    setEditingCategoryId(null);
    setShowCategoryModal(false);

    alert(
      isEditing
        ? "Category updated successfully."
        : "Category added successfully."
    );
  } catch (error) {
    console.error("Save Category Error:", error);
    alert("Something went wrong while saving category.");
  }
};


const handleDeleteCategory = async (categoryId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `/api/owners/categories/${categoryId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete category.");
      return;
    }

    setCategories((prev) =>
      prev.filter((category) => category.id !== categoryId)
    );

    alert("Category deleted successfully.");
  } catch (error) {
    console.error("Delete Category Error:", error);
    alert("Something went wrong while deleting category.");
  }
};


const handleDeleteMenuItem = async (itemId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this menu item?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `/api/owners/menu-items/${itemId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete menu item.");
      return;
    }

    setMenuItems((prev) =>
      prev.filter((item) => String(item.id) !== String(itemId))
    );

    setBranchMenuItems((prev) =>
      prev.filter((item) => String(item.id) !== String(itemId))
    );

    alert("Menu item deleted successfully.");
  } catch (error) {
    console.error("Delete Menu Item Error:", error);
    alert("Something went wrong while deleting menu item.");
  }
};

const handleAddVariant = () => {
  setItemVariants((prev) => [
    ...prev,
    {
      size: "",
      quantity: "",
      price: "",
    },
  ]);
};

const handleRemoveVariant = (index) => {
  setItemVariants((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

const handleVariantChange = (index, field, value) => {
  setItemVariants((prev) =>
    prev.map((variant, i) =>
      i === index
        ? { ...variant, [field]: value }
        : variant
    )
  );
};

const handleEditMenuItem = (item) => {
  setEditingMenuItemId(item.id);

  setItemName(item.name || "");
  setItemDescription(item.description || "");
  setItemCategory(item.categoryId || "");
  setItemFoodType(item.foodType || "Veg");
  setItemPrice(String(item.price ?? ""));

  setItemVariants(item.variants || []);
setUseVariants((item.variants || []).length > 0);

  setItemImage(item.image || "");
  setImagePreview(item.image || "");
 
  setItemRecommended(item.isRecommended ?? false);

  setItemRestaurantIds(
    (item.restaurantIds || []).map((branch) =>
      typeof branch === "string"
        ? branch
        : branch._id || branch.id
    )
  );

  setShowMenuItemModal(true);
};


const handleImageUpload = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setImageError("Only JPG, PNG and WEBP images are allowed.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setImageError("Image size must be less than 5 MB.");
    event.target.value = "";
    return;
  }

  setImageError("");
  setUploadingImage(true);

  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/owners/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed.");
    }

    setItemImage(data.imageUrl);
  } catch (error) {
  console.error("Image upload error:", error);

  setImageError(error.message || "Image upload failed.");
  setImagePreview("");
  setItemImage("");
} finally {
    setUploadingImage(false);
    event.target.value = "";
  }
};

const handleCategoryImageUpload = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setCategoryImageError("Only JPG, PNG and WEBP images are allowed.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setCategoryImageError("Image size must be less than 5 MB.");
    event.target.value = "";
    return;
  }

  setCategoryImageError("");
  setCategoryImage("");
  setUploadingCategoryImage(true);

  const previewUrl = URL.createObjectURL(file);
  setCategoryImagePreview(previewUrl);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/owners/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log("Upload API Response:", data);
console.log("Cloudinary Image URL:", data.imageUrl);

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed.");
    }

    setCategoryImage(data.imageUrl);
  } catch (error) {
    console.error("Category Image Upload Error:", error);

    setCategoryImageError(error.message || "Image upload failed.");
    setCategoryImagePreview("");
    setCategoryImage("");
  } finally {
    setUploadingCategoryImage(false);
    event.target.value = "";
  }
};

const handleSaveMenuItem = async () => {
  if (!itemName.trim()) {
    alert("Please enter food name.");
    return;
  }

  if (!itemCategory) {
    alert("Please select category.");
    return;
  }

  if (itemRestaurantIds.length === 0) {
    alert("Please select at least one branch.");
    return;
  }

const selectedCategory = categories.find(
  (category) => String(category.id) === String(itemCategory)
);

const allowedBranchIds = (selectedCategory?.restaurantIds || [])
  .map((branch) =>
    String(
      typeof branch === "string"
        ? branch
        : branch?._id || branch?.id || ""
    )
  )
  .filter(Boolean);

const invalidBranchSelected = itemRestaurantIds.some(
  (branchId) => !allowedBranchIds.includes(String(branchId))
);

if (invalidBranchSelected) {
  alert(
    "Selected branches do not belong to this category. Please select branches again."
  );
  setItemRestaurantIds([]);
  return;
}

  if (
    itemPrice === "" ||
    !Number.isFinite(Number(itemPrice)) ||
    Number(itemPrice) < 0
  ) {
    alert("Please enter a valid price.");
    return;
  }

    if (useVariants) {
    if (itemVariants.length === 0) {
      alert("Please add at least one size variant.");
      return;
    }

    const invalidVariant = itemVariants.some(
      (variant) =>
        !variant.size.trim() ||
        !variant.quantity.trim() ||
        variant.price === "" ||
        !Number.isFinite(Number(variant.price)) ||
        Number(variant.price) < 0
    );

    if (invalidVariant) {
      alert("Please enter valid size, quantity and price for every variant.");
      return;
    }
  }

  try {
    const isEditing = editingMenuItemId !== null;

    const response = await fetch(
      isEditing
        ? `/api/owners/menu-items/${editingMenuItemId}`
        : "/api/owners/menu-items",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: itemName.trim(),
          description: itemDescription.trim(),
          restaurantIds: itemRestaurantIds,
          categoryId: itemCategory,
          foodType: itemFoodType,
          price: Number(itemPrice),
          variants: useVariants
  ? itemVariants.map((variant) => ({
      size: variant.size.trim(),
      quantity: variant.quantity.trim(),
      price: Number(variant.price),
    }))
  : [],
          image: itemImage.trim(),
          
          isRecommended: itemRecommended,
        }),

      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to save menu item.");
      return;
    }

    const savedItem = {
      ...data.menuItem,
      id: data.menuItem._id,
      categoryId: data.menuItem.categoryId?._id || itemCategory,
      categoryName:
        data.menuItem.categoryId?.name ||
        categories.find((category) => category.id === itemCategory)?.name ||
        "Uncategorized",
      restaurantIds: data.menuItem.restaurantIds || itemRestaurantIds,
    };

    if (isEditing) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingMenuItemId ? savedItem : item
        )
      );
    } else {
      setMenuItems((prev) => [savedItem, ...prev]);
    }

    setItemName("");
    setItemDescription("");
    setItemCategory("");
    setItemRestaurantIds([]);
    setItemFoodType("Veg");
    setItemPrice("");
    setItemVariants([]);
setUseVariants(false); 
    setItemImage("");
    setImagePreview("");
    setImageError("");
   
    setItemRecommended(false);
    setEditingMenuItemId(null);
    setShowMenuItemModal(false);

    alert(
      isEditing
        ? "Menu item updated successfully."
        : "Menu item added successfully."
    );
  } catch (error) {
    console.error("Save Menu Item Error:", error);
    alert("Something went wrong while saving menu item.");
  }
};


const availableItemsCount = branchMenuItems.filter((item) => {
  const branchStatus = (item.branchAvailability || []).find(
    (branch) =>
      String(branch.restaurantId?._id || branch.restaurantId) ===
      String(selectedBranchId)
  );

  return branchStatus ? branchStatus.isAvailable : true;
}).length;


  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <OwnerSidebar />

      <main className="ml-64 min-h-screen bg-[#F8F5F0] px-8 py-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <div>
            <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#B87932]">Restaurant Operations</p>
            <h1 className="text-3xl font-bold tracking-tight text-[#17211D]">
              Menu Management
            </h1>
            <p className="mt-2 text-sm text-[#716B64]">
              Manage food categories and menu items.
            </p>
            </div>
          </div>
<button
  onClick={() => setShowMenuItemModal(true)}
  className="rounded-xl bg-[#D9A65B] px-6 py-3 text-sm font-bold text-[#17211D] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#C9944D]"
>
  + Add Menu Item
</button>
        </div>

        {/* MENU SUMMARY */}
        <div
  className={`mb-7 grid gap-5 ${
    activeTab === "branches" && selectedBranchId
      ? "grid-cols-3"
      : "grid-cols-2"
  }`}
>
          <div className="relative overflow-hidden rounded-[22px] border border-[#E9DED0] bg-white p-6 shadow-[0_8px_28px_rgba(56,39,19,0.045)]">
            <p className="text-sm font-medium text-[#81766B]">Total Categories</p>
       <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#003B32]">
  {activeTab === "branches" && selectedBranchId
    ? categories.filter((category) =>
        (category.restaurantIds || []).some((branch) => {
          const branchId =
            typeof branch === "string"
              ? branch
              : branch?._id || branch?.id || branch;

          return String(branchId) === String(selectedBranchId);
        })
      ).length
    : categories.length}
</h2>
          </div>

          <div className="relative overflow-hidden rounded-[22px] border border-[#E9DED0] bg-white p-6 shadow-[0_8px_28px_rgba(56,39,19,0.045)]">
            <p className="text-sm font-medium text-[#81766B]">Total Menu Items</p>
         <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#003B32]">
  {activeTab === "branches" && selectedBranchId
    ? branchMenuItems.length
    : menuItems.length}
</h2>
          </div>

          {activeTab === "branches" && selectedBranchId && (
  <div className="relative overflow-hidden rounded-[22px] border border-[#E9DED0] bg-white p-6 shadow-[0_8px_28px_rgba(56,39,19,0.045)]">
    <p className="text-sm font-medium text-[#81766B]">Available Items</p>
    <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#003B32]">
      {availableItemsCount}
    </h2>
  </div>
)}

        </div>

        {/* TABS */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-[#E9DED0] bg-white p-2 shadow-sm">
          <button
            onClick={() => setActiveTab("items")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "items"
                ? "bg-[#003B32] text-white shadow-sm"
                : "text-[#716B64] hover:bg-[#F8F4EE]"
            }`}
          >
            Menu Items
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "categories"
                ? "bg-[#003B32] text-white shadow-sm"
                : "text-[#716B64] hover:bg-[#F8F4EE]"
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => setActiveTab("branches")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "branches"
                ? "bg-[#003B32] text-white shadow-sm"
                : "text-[#716B64] hover:bg-[#F8F4EE]"
            }`}
          >
            Branch Menu
          </button>
        </div>



{/* ADD MENU ITEM MODAL */}
{showMenuItemModal && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001F1B]/55 p-6 backdrop-blur-sm overflow-y-auto">
<div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[26px] border border-[#E9DED0] bg-[#FFFEFC] shadow-2xl">

   <div className="flex shrink-0 items-center justify-between border-b border-[#EDE3D8] bg-[#FCF9F5] px-9 py-6">
      <h2 className="text-xl font-bold text-[#17211D]">
  {editingMenuItemId ? "Edit Menu Item" : "Add Menu Item"}
</h2>

        <button
          onClick={() => setShowMenuItemModal(false)}
          className="text-xl text-gray-500"
        >
          ×
        </button>
      </div>

    <div className="flex-1 overflow-y-auto px-9 py-8">
 <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Food Name *
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Paneer Tikka"
            className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] p-3 outline-none transition focus:border-[#D2A66A] focus:ring-2 focus:ring-[#D2A66A]/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Category *
          </label>
          <select
            value={itemCategory}
           onChange={(e) => {
  setItemCategory(e.target.value);
  setItemRestaurantIds([]);
}}
            className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] p-3 outline-none transition focus:border-[#D2A66A] focus:ring-2 focus:ring-[#D2A66A]/20"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

     {/* Branch Selection */}
<div className="md:col-span-2">
  <label className="mb-3 block text-sm font-medium">
    Select Branches *
  </label>

  <div className="space-y-3 rounded-xl border p-4">
    {branches
      .filter((branch) => {
        const selectedCategory = categories.find(
          (category) => category.id === itemCategory
        );

  const categoryBranchIds = (
  selectedCategory?.restaurantIds || []
)
  .map((branch) =>
    String(
      typeof branch === "string"
        ? branch
        : branch?._id || branch?.id || ""
    )
  )
  .filter(Boolean);

        return categoryBranchIds.includes(String(branch.id));
      })
      .map((branch) => (
        <label key={branch.id} className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={itemRestaurantIds.includes(branch.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setItemRestaurantIds((prev) => [...prev, branch.id]);
              } else {
                setItemRestaurantIds((prev) =>
                  prev.filter((id) => id !== branch.id)
                );
              }
            }}
          />
          <span>{branch.name} — {branch.city}</span>
        </label>
      ))}

    {!itemCategory && (
      <p className="text-sm text-gray-400">
        Please select a category first.
      </p>
    )}
  </div>
</div>

{/* Food Type */}
        <div>
          
          <label className="mb-2 block text-sm font-medium">
            Food Type *
          </label>
          <select
            value={itemFoodType}
            onChange={(e) => setItemFoodType(e.target.value)}
            className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] p-3 outline-none transition"
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Egg">Egg</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Price (₹) *
          </label>
          <input
            type="number"
            min="0"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            placeholder="280"
            className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] p-3 outline-none transition"
          />
        </div>

{/* Size Variants */}
<div className="md:col-span-2 rounded-xl border border-[#E9DED0] p-4">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-sm font-semibold text-[#17211D]">
        Size Variants
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Add different sizes, quantities and prices.
      </p>
    </div>

    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={useVariants}
onChange={(e) => {
  const isEnabled = e.target.checked;

  setUseVariants(isEnabled);

  if (isEnabled && itemVariants.length === 0) {
    setItemVariants([
      { size: "", quantity: "", price: "" },
    ]);
  }
}}
      />
      Enable Sizes
    </label>
  </div>

  {useVariants && (
    <div className="mt-4 space-y-3">
      {itemVariants.map((variant, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 rounded-xl border border-[#E9DED0] bg-[#F8F4EE] p-3 md:grid-cols-4"
        >
          <input
            type="text"
            value={variant.size}
            onChange={(e) =>
              handleVariantChange(index, "size", e.target.value)
            }
            placeholder="Size (Small)"
            className="rounded-xl border border-[#E5D9CB] bg-white p-3 text-sm outline-none focus:border-[#D2A66A]"
          />

          <input
            type="text"
            value={variant.quantity}
            onChange={(e) =>
              handleVariantChange(index, "quantity", e.target.value)
            }
            placeholder="Quantity (200 ml)"
            className="rounded-xl border border-[#E5D9CB] bg-white p-3 text-sm outline-none focus:border-[#D2A66A]"
          />

          <input
            type="number"
            min="0"
            value={variant.price}
            onChange={(e) =>
              handleVariantChange(index, "price", e.target.value)
            }
            placeholder="Price (₹)"
            className="rounded-xl border border-[#E5D9CB] bg-white p-3 text-sm outline-none focus:border-[#D2A66A]"
          />

          <button
            type="button"
            onClick={() => handleRemoveVariant(index)}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddVariant}
        className="rounded-lg bg-[#003B32] px-4 py-2 text-sm font-semibold text-white"
      >
        + Add Another Size
      </button>
    </div>
  )}
</div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Describe your food item..."
            rows={3}
            className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] p-3 outline-none transition"
          />
        </div>


<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium">
    Food Image
  </label>

  {/* Choose Existing Image */}
  <label className="mb-2 block text-sm font-medium">
    Choose from Existing Images
  </label>

  <select
    value={
      itemImage.startsWith("/restaurants/")
        ? itemImage
        : ""
    }
    onChange={(e) => {
      const imagePath = e.target.value;
      setItemImage(imagePath);
      setImagePreview(imagePath);
      setImageError("");
    }}
    className="mb-4 w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] p-3 outline-none transition"
  >
  <option value="">Select an image</option>

<optgroup label="Desserts">
  <option value="/restaurants/spice-route/menu/desserts/rasmalai.jpg">
    Rasmalai
  </option>

  <option value="/restaurants/spice-route/menu/desserts/gulab-jamun.jpg">
    Gulab Jamun
  </option>
</optgroup>

<optgroup label="Starters">
  <option value="/restaurants/spice-route/menu/starters/paneer-tikka.jpg">
    Paneer Tikka
  </option>
</optgroup>
  </select>

  {/* Upload New Image */}
  <label className="mb-2 block text-sm font-medium">
    Or Upload New Image
  </label>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={handleImageUpload}
    className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] p-3 outline-none transition"
  />

  <p className="mt-1 text-xs text-gray-500">
    JPG, PNG, WEBP · Maximum 5 MB
  </p>

  {uploadingImage && (
    <p className="mt-2 text-sm text-blue-600">
      Uploading image...
    </p>
  )}

  {imageError && (
    <p className="mt-2 text-sm text-red-600">
      {imageError}
    </p>
  )}

  {imagePreview && (
    <div className="mt-3">
      <img
        src={imagePreview}
        alt="Food preview"
        className="h-32 w-32 rounded-xl border object-cover"
      />
    </div>
  )}
</div>


        <div className="md:col-span-2 flex flex-wrap gap-6">


          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={itemRecommended}
              onChange={(e) => setItemRecommended(e.target.checked)}
            />
            Recommended Item
          </label>
        </div>

      </div>

</div>

    <div className="flex shrink-0 justify-end gap-3 border-t border-[#EDE3D8] bg-[#FCF9F5] px-9 py-5">
        <button
          onClick={() => setShowMenuItemModal(false)}
          className="rounded-xl border px-5 py-3 text-sm"
        >
          Cancel
        </button>

<button
  type="button"
  onClick={handleSaveMenuItem}
  className="rounded-xl bg-[#D9A65B] px-6 py-3 text-sm font-bold text-[#17211D] shadow-sm transition hover:bg-[#C9944D]"
>
  {editingMenuItemId ? "Update Menu Item" : "Save Menu Item"}
</button>
      </div>

    </div>
  </div>
)}



{/* ADD CATEGORY MODAL */}
{showCategoryModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001F1B]/55 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-[24px] border border-[#E9DED0] bg-[#FFFEFC] p-7 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Add Category</h2>

        <button
          onClick={() => setShowCategoryModal(false)}
          className="text-xl text-gray-500"
        >
          &times;
        </button>
      </div>

<div className="space-y-4">
  <div>
    <label className="mb-2 block text-sm font-medium">
      Category Name *
    </label>
    <input
      type="text"
      value={categoryName}
      onChange={(e) => setCategoryName(e.target.value)}
      placeholder="e.g. Starters"
      className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] px-4 py-3 outline-none transition focus:border-[#D2A66A] focus:ring-2 focus:ring-[#D2A66A]/20"
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium">
      Description
    </label>
    <textarea
      value={categoryDescription}
      onChange={(e) => setCategoryDescription(e.target.value)}
      placeholder="Enter category description"
      rows={3}
      className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] px-4 py-3 outline-none transition focus:border-[#D2A66A] focus:ring-2 focus:ring-[#D2A66A]/20"
    />
  </div>

  {/* CATEGORY IMAGE UPLOAD */}
<div>
  <label className="mb-2 block text-sm font-medium">
    Category Image
  </label>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={handleCategoryImageUpload}
    className="w-full rounded-xl border border-[#E5D9CB] bg-white p-3 text-sm outline-none focus:border-[#D2A66A]"
  />

  <p className="mt-1 text-xs text-gray-500">
    JPG, PNG or WEBP. Maximum size 5 MB.
  </p>

  {uploadingCategoryImage && (
    <p className="mt-2 text-sm text-amber-600">
      Uploading image...
    </p>
  )}

  {categoryImageError && (
    <p className="mt-2 text-sm text-red-600">
      {categoryImageError}
    </p>
  )}

  {categoryImagePreview && (
    <div className="mt-3">
      <img
        src={categoryImagePreview}
        alt="Category Preview"
        className="h-32 w-48 rounded-xl border object-cover"
      />
    </div>
  )}
</div>

  <div>
    <label className="mb-3 block text-sm font-medium">
      Select Branches *
    </label>

    <div className="space-y-3 rounded-xl border p-4">
      {branches.map((branch) => (
        <label
          key={branch.id}
          className="flex cursor-pointer items-center gap-3 text-sm"
        >
          <input
            type="checkbox"
            checked={categoryRestaurantIds.includes(branch.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setCategoryRestaurantIds((prev) => [
                  ...prev,
                  branch.id,
                ]);
              } else {
                setCategoryRestaurantIds((prev) =>
                  prev.filter((id) => id !== branch.id)
                );
              }
            }}
          />

          <span>
            {branch.name} — {branch.city}
          </span>
        </label>
      ))}

      {branches.length === 0 && (
        <p className="text-sm text-gray-400">
          No branches found.
        </p>
      )}
    </div>
  </div>
</div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowCategoryModal(false)}
          className="rounded-lg border px-5 py-3 text-sm"
        >
          Cancel
        </button>

     <button
  onClick={handleSaveCategory}
  className="rounded-xl bg-[#D9A65B] px-5 py-3 text-sm font-bold text-[#17211D] shadow-sm transition hover:bg-[#C9944D]"
>
  Save Category
</button>

      </div>
    </div>
  </div>
)}


        {/* CONTENT */}
        <div className="rounded-[24px] border border-[#E9DED0] bg-white p-7 shadow-[0_8px_28px_rgba(56,39,19,0.045)]">

{activeTab === "items" && (
  <div>
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">Menu Items</h2>
        <p className="mt-1 text-sm text-[#716B64]">
          Manage your restaurant food items.
        </p>
      </div>

      <span className="rounded-lg bg-[#F7EBDD] text-[#8C5B25] px-4 py-2 text-sm font-semibold">
        {menuItems.length} Items
      </span>
    </div>

    {menuItems.length === 0 ? (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold">
          No Menu Items Yet
        </h3>
        <p className="mt-2 text-sm text-[#716B64]">
          Start adding food items to your restaurant menu.
        </p>
      </div>
    ) : (
     <div ref={menuTableRef} className="overflow-x-auto">
      <table className="w-full table-fixed border-separate border-spacing-0 text-left">

<colgroup>
  <col style={{ width: "38%" }} />
  <col style={{ width: "25%" }} />
  <col style={{ width: "15%" }} />
  <col style={{ width: "22%" }} />
</colgroup>

          <thead>
            <tr className="bg-[#F8F4EE] text-xs uppercase tracking-[0.12em] text-[#81766B]">
              <th className="p-4">Food Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Food Type</th>
              {/* <th className="p-4">Price</th> */}
            
            <th className="p-4 pr-6 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {menuItems.map((item) => (

<Fragment key={item.id}>
<tr
  className="cursor-pointer border-b border-[#F0E8DE] transition hover:bg-[#FBF7F0]"
    onClick={() =>
      setExpandedItemId(
        expandedItemId === item.id ? null : item.id
      )
    }
  >
    <td className="p-4">
      <div className="flex items-center gap-3">
        <img
          src={item.image || "/restaurants/default-food.png"}
          alt={item.name}
          className="h-14 w-14 rounded-2xl border border-[#E9DED0] object-cover shadow-sm"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/restaurants/default-food.png";
          }}
        />

        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="mt-1 text-xs text-[#9A9289]">
            {item.description}
          </p>
        </div>
      </div>
    </td>

    <td className="p-4 text-sm">
      {item.categoryName || "Uncategorized"}
    </td>

    <td className="p-4 text-sm">
      {item.foodType}
    </td>

    <td className="p-4 pr-6">
      <div
        className="flex items-center justify-end gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => handleEditMenuItem(item)}
          className="rounded-lg border border-[#E8D8C4] px-4 py-2 text-sm font-semibold text-[#72502D] transition hover:bg-[#FBF4EA]"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => handleDeleteMenuItem(item.id)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>

  {expandedItemId === item.id && (
    <tr className="border-b bg-[#FAF8F5]">
      <td colSpan={4} className="px-6 py-4">
        {item.variants?.length > 0 ? (
          <div className="max-w-xl">
            <h4 className="mb-3 font-semibold text-[#17211D]">
              Available Sizes & Prices
            </h4>

            <div className="space-y-2">
              {item.variants.map((variant, index) => (
                <div
                  key={index}
                 className="grid grid-cols-3 items-center rounded-lg border border-[#E9DED0] bg-white px-4 py-3"
                >
<span className="text-left font-medium">
  {variant.size}
</span>

<span className="text-center text-sm text-[#716B64]">
  {variant.quantity}
</span>

<span className="text-right font-semibold">
  ₹{variant.price}
</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#716B64]">
            No size variants added for this item.
          </p>
        )}
      </td>
    </tr>
  )}
</Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}


          {activeTab === "categories" && (
           <div>
  <div className="mb-5 flex items-center justify-between">
    <h2 className="text-xl font-bold">Food Categories</h2>

    <button
      onClick={() => setShowCategoryModal(true)}
      className="rounded-xl bg-[#D9A65B] px-5 py-3 text-sm font-bold text-[#17211D] shadow-sm transition hover:bg-[#C9944D] text-black"
    >
      + Add Category
    </button>
  </div>

  <p className="mt-2 text-sm text-[#716B64]">
    Create and manage your food categories here.
  </p>

<div className="mt-6 space-y-3">
  {categories.length === 0 ? (
    <p className="text-sm text-gray-400">
      No categories added yet.
    </p>
  ) : (
    categories.map((category) => (
      <div
        key={category.id}
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E9DED0] bg-white p-5 transition hover:border-[#D9A65B]/60 hover:shadow-sm"
      >
     <div className="flex-1">
  <h3 className="font-semibold text-[#17211D]">
    {category.name}
  </h3>
  <p className="mt-1 text-sm text-[#716B64]">
    {category.description || "No description"}
  </p>
</div>

<div className="flex items-center gap-2">
  <button
    onClick={() => handleEditCategory(category)}
    className="rounded-lg border border-[#E8D8C4] px-4 py-2 text-sm font-semibold text-[#72502D] transition hover:bg-[#FBF4EA]"
  >
    Edit
  </button>

  <button
    onClick={() => handleDeleteCategory(category.id)}
    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
  >
    Delete
  </button>
</div>
      </div>
    ))
  )}
</div>

</div>
          )}

          {activeTab === "branches" && (
            <div>
              <h2 className="text-xl font-bold">Branch Menu Settings</h2>
              <p className="mt-2 text-sm text-[#716B64]">
                Manage shared menus and branch-wise customization here.
              </p>

<div className="mt-6 max-w-md">
  <label className="mb-2 block text-sm font-medium">
    Select Branch
  </label>

  <select
    value={selectedBranchId}
    onChange={(e) => setSelectedBranchId(e.target.value)}
    className="w-full rounded-xl border border-[#E5D9CB] bg-[#FAF7F2] p-3 outline-none transition focus:border-[#D2A66A] focus:ring-2 focus:ring-[#D2A66A]/20"
  >
    <option value="">Select a branch</option>

    {branches.map((branch) => (
      <option key={branch.id} value={branch.id}>
        {branch.name} — {branch.city}
      </option>
    ))}
  </select>
</div>


{selectedBranchId && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold">Branch Menu Items</h3>

    {branchMenuItems.length === 0 ? (
      <p className="mt-3 text-sm text-gray-500">
        No menu items assigned to this branch yet.
      </p>
    ) : (
      <div className="mt-4 space-y-3">
{branchMenuItems.map((item) => (
  <div
    key={item.id}
    className="rounded-2xl border border-[#E9DED0] bg-white p-5 shadow-sm"
  >
    <div className="flex items-center justify-between gap-4">

      <div className="flex items-center gap-4">
        <img
          src={item.image || "/restaurants/default-food.png"}
          alt={item.name}
          className="h-20 w-20 rounded-xl border border-gray-200 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/restaurants/default-food.png";
          }}
        />

        <div>
          <p className="font-semibold">{item.name}</p>

          <p className="mt-1 text-sm text-gray-500">
            {item.categoryName}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {item.description}
          </p>
        </div>
      </div>

    
<div className="flex flex-col items-end gap-3">
  <p className="font-semibold whitespace-nowrap">
    ₹{item.price}
  </p>

  {(() => {
    const branchStatus = (item.branchAvailability || []).find(
      (branch) =>
        String(branch.restaurantId?._id || branch.restaurantId) ===
        String(selectedBranchId)
    );

    const isAvailable = branchStatus
      ? branchStatus.isAvailable
      : true;

    return (
      <button
        type="button"
        onClick={() => handleToggleBranchAvailability(item)}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
          isAvailable
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-red-50 text-red-700 ring-1 ring-red-200"
        }`}
      >
        {isAvailable ? "Available" : "Unavailable"}
      </button>
    );
  })()}
</div>


    </div>
  </div>
))}
      </div>
    )}
  </div>
)}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
