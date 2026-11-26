
import mongoose from "mongoose";

const TableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Reserved", "Needs Cleaning"],
      default: "Available",
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

    qrCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Same table number cannot repeat within the same branch
TableSchema.index(
  { restaurantId: 1, tableNumber: 1 },
  { unique: true }
);

const Table =
  mongoose.models.Table ||
  mongoose.model("Table", TableSchema);

export default Table;
