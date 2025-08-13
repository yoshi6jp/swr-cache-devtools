import { NextRequest, NextResponse } from "next/server";

// Mock analytics data
const analyticsData = {
  electronics: {
    totalProducts: 50,
    averagePrice: 629,
    averageRating: 4.7,
    inStock: 45,
  },
  clothing: {
    totalProducts: 120,
    averagePrice: 82,
    averageRating: 4.3,
    inStock: 98,
  },
  books: {
    totalProducts: 75,
    averagePrice: 37,
    averageRating: 4.5,
    inStock: 73,
  },
  home: {
    totalProducts: 95,
    averagePrice: 92,
    averageRating: 4.2,
    inStock: 82,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { category } = await params;

  const data = analyticsData[category as keyof typeof analyticsData];

  if (!data) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({
    category,
    analytics: data,
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substring(2, 11),
  });
}
