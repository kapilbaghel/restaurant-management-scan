import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    pinHash: {
  type: String,
  default: "",
  select: false,
},

sessionTokenHash: {
  type: String,
  default: "",
  select: false,
},
sessionExpiresAt: {
  type: Date,
  default: null,
},

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },
  },
  { timestamps: true }
);

customerSchema.index(
  { restaurantId: 1, mobile: 1 },
  { unique: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);