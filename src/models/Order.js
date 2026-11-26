
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },

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

    customerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Customer",
  default: null,
},

customerAccountId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "CustomerAccount",
  default: null,
},

    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

selectedSize: {
  type: String,
  default: "",
},

selectedQuantity: {
  type: String,
  default: "",
},

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        total: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Preparing", "Ready", "Served", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ ownerId: 1, restaurantId: 1, createdAt: -1 });

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);

export default Order;
