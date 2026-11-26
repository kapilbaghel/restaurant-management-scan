
import mongoose from "mongoose";

const customerAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },

    // Secure customer login session
    sessionTokenHash: {
      type: String,
      default: "",
      select: false,
    },

    sessionExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const CustomerAccount =
  mongoose.models.CustomerAccount ||
  mongoose.model("CustomerAccount", customerAccountSchema);

export default CustomerAccount;
