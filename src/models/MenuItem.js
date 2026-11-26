
import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Item belongs to an Owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    // Branches where this item is available
    restaurantIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
      },
    ],

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    foodType: {
      type: String,
      enum: ["Veg", "Non-Veg", "Egg"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    variants: [
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
],

    image: {
      type: String,
      default: "",
    },

branchAvailability: [
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
],

    isRecommended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MenuItemSchema.index({ ownerId: 1, restaurantIds: 1, categoryId: 1 });

const MenuItem =
  mongoose.models.MenuItem ||
  mongoose.model("MenuItem", MenuItemSchema);

export default MenuItem;
