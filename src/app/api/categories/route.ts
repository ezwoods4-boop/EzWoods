// File: src/app/api/categories/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { Category } from "@/models/category";
import { Product } from "@/models/product"; // ensures Product schema is registered

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const withProducts = searchParams.get("withProducts") === "true";

    let query = Category.find({ status: "active" }).sort({ name: 1 });

    if (withProducts) {
      // Return full products list under each category
      query = query.populate({
        path: "products", // define this virtual in Category schema
        model: Product,
        select: "name price stock images status", // pick what you want
      });
    } else {
      // Return only product count (your existing virtual)
      query = query.populate("productCount");
    }

    const categories = await query.exec();

    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error in /api/categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
