
import mongoose from "mongoose";
import { createHash } from "crypto";
import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Restaurant from "@/models/Restaurant";
import Table from "@/models/Table";
import MenuItem from "@/models/MenuItem";
import Order from "@/models/Order";
import CustomerAccount from "@/models/CustomerAccount";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { restaurantId, tableId, items } = body;

    // Basic validation
    if (
      !restaurantId ||
      !tableId ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Restaurant, table and order items are required",
        },
        { status: 400 }
      );
    }

    // Validate MongoDB IDs
    if (
      !mongoose.Types.ObjectId.isValid(restaurantId) ||
      !mongoose.Types.ObjectId.isValid(tableId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid restaurant or table ID",
        },
        { status: 400 }
      );
    }

    // Find active restaurant
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      status: "Active",
    });

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          message: "Restaurant not found or inactive",
        },
        { status: 404 }
      );
    }

    // Verify table belongs to this restaurant
    const table = await Table.findOne({
      _id: tableId,
      restaurantId: restaurantId,
    });

    if (!table) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid table for this restaurant",
        },
        { status: 404 }
      );
    }

    // Authenticate customer using global session cookie
    const sessionToken = request.cookies.get("customer_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login before placing an order.",
        },
        { status: 401 }
      );
    }

    const sessionTokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    const customer = await CustomerAccount.findOne({
      sessionTokenHash,
      sessionExpiresAt: { $gt: new Date() },
      status: "Active",
    });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Your session has expired. Please login again.",
        },
        { status: 401 }
      );
    }

    // Validate menu item IDs
    if (
      items.some(
        (item) =>
          !item.menuItemId ||
          !mongoose.Types.ObjectId.isValid(item.menuItemId)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid menu item ID",
        },
        { status: 400 }
      );
    }

    // Get unique menu item IDs
    const menuItemIds = [
      ...new Set(items.map((item) => item.menuItemId)),
    ];

    // Find menu items in database
    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
      ownerId: restaurant.ownerId,
      restaurantIds: restaurantId,
    });

    // Check if all requested items exist
    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Some menu items are invalid or unavailable",
        },
        { status: 400 }
      );
    }

    // Maximum 50 quantity for selected Lassi items
    const lassiItemNames = [
      "Mango Lassi",
      "Sweet Lassi",
      "Masala Chaas",
    ];

    const lassiQuantities = {};

    for (const cartItem of items) {
      const menuItem = menuItems.find(
        (item) =>
          item._id.toString() === String(cartItem.menuItemId)
      );

      const quantity = Number(cartItem.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid item quantity",
          },
          { status: 400 }
        );
      }

      if (lassiItemNames.includes(menuItem.name.trim())) {
        const itemId = menuItem._id.toString();

        lassiQuantities[itemId] =
          (lassiQuantities[itemId] || 0) + quantity;

        if (lassiQuantities[itemId] > 50) {
          return NextResponse.json(
            {
              success: false,
              message: `Maximum 50 quantity allowed for ${menuItem.name}.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Prepare order items using database prices
    const orderItems = [];

    for (const cartItem of items) {
      const menuItem = menuItems.find(
        (item) =>
          item._id.toString() === String(cartItem.menuItemId)
      );

      const quantity = Number(cartItem.quantity);

      // Validate quantity
      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid item quantity",
          },
          { status: 400 }
        );
      }

      // Check branch availability
      const branchAvailability = menuItem.branchAvailability.find(
        (branch) =>
          branch.restaurantId.toString() === restaurantId
      );

      if (branchAvailability && !branchAvailability.isAvailable) {
        return NextResponse.json(
          {
            success: false,
            message: `${menuItem.name} is currently unavailable`,
          },
          { status: 400 }
        );
      }

      // Calculate price using selected variant from database
      let selectedVariant = null;

      if (menuItem.variants?.length > 0) {
        selectedVariant = menuItem.variants.find(
          (variant) => variant.size === cartItem.selectedSize
        );

        if (!selectedVariant) {
          return NextResponse.json(
            {
              success: false,
              message: `Please select a valid size for ${menuItem.name}`,
            },
            { status: 400 }
          );
        }
      }

      const price = selectedVariant
        ? selectedVariant.price
        : menuItem.price;

      const total = price * quantity;

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        selectedSize: selectedVariant ? selectedVariant.size : "",
        selectedQuantity: selectedVariant
          ? selectedVariant.quantity
          : "",
        price,
        quantity,
        total,
      });
    }

    // Calculate final order amount
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order with global customer account
    const newOrder = await Order.create({
      orderNumber,
      ownerId: restaurant.ownerId,
      restaurantId: restaurant._id,

      // New global customer account
      customerAccountId: customer._id,

      // Legacy customer reference is not used for new orders
      customerId: null,

      tableId: table._id,
      items: orderItems,
      totalAmount,
      status: "Pending",
      paymentStatus: "Unpaid",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating order",
      },
      { status: 500 }
    );
  }
}
