
import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema(
  {

ownerCode: {
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

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
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

    pan: {
      type: String,
      default: "",
    },

    aadhaar: {
      type: String,
      default: "",
    },

    panDocument: {
      type: String,
      default: "",
    },

    aadhaarDocument: {
      type: String,
      default: "",
    },

    passwordHash: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    invitationTokenHash: {
      type: String,
      default: null,
    },

    invitationExpiresAt: {
      type: Date,
      default: null,
    },

    passwordSetAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Owner =
  mongoose.models.Owner ||
  mongoose.model("Owner", OwnerSchema);

export default Owner;
