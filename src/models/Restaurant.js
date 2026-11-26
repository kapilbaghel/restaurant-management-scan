
import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {

restaurantCode: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
},

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
},

    gst: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    managerId: {
      type: String,
      default: null,
    },

    location: {
  type: String,
  default: "",
},

    branchType: {
      type: String,
      default: "main",
    },

    parentRestaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant =
  mongoose.models.Restaurant ||
  mongoose.model("Restaurant", RestaurantSchema);

export default Restaurant;
