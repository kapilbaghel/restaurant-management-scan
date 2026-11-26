
import mongoose from "mongoose";

const customerOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    lastSentAt: {
      type: Date,
      required: true,
    },

    pendingName: {
  type: String,
  default: "",
  trim: true,
},

pendingMobile: {
  type: String,
  default: "",
  trim: true,
},

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired OTP records
customerOtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const CustomerOtp =
  mongoose.models.CustomerOtp ||
  mongoose.model("CustomerOtp", customerOtpSchema);

export default CustomerOtp;
