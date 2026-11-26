
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
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

    image: {
  type: String,
  default: "",
  trim: true,
},

    // Category belongs to an Owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    // Branches where this category is available
    restaurantIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Same category name cannot be duplicated for the same owner
CategorySchema.index(
  { ownerId: 1, name: 1 },
  { unique: true }
);

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);

export default Category;
