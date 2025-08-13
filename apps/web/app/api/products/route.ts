import { NextRequest, NextResponse } from "next/server";

// Mock products data
const products = [
  // Electronics
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999,
    category: "electronics",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: 1099,
    category: "electronics",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 3,
    name: "iPad Pro",
    price: 799,
    category: "electronics",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 4,
    name: "Apple Watch Ultra",
    price: 799,
    category: "electronics",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 5,
    name: "AirPods Pro",
    price: 249,
    category: "electronics",
    rating: 4.5,
    inStock: true,
  },

  // Clothing
  {
    id: 6,
    name: "Cotton T-Shirt",
    price: 29,
    category: "clothing",
    rating: 4.2,
    inStock: true,
  },
  {
    id: 7,
    name: "Denim Jeans",
    price: 89,
    category: "clothing",
    rating: 4.3,
    inStock: false,
  },
  {
    id: 8,
    name: "Wool Sweater",
    price: 128,
    category: "clothing",
    rating: 4.4,
    inStock: true,
  },

  // Books
  {
    id: 9,
    name: "React Handbook",
    price: 32,
    category: "books",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 10,
    name: "TypeScript Guide",
    price: 41,
    category: "books",
    rating: 4.7,
    inStock: true,
  },

  // Home & Garden
  {
    id: 11,
    name: "Coffee Maker",
    price: 156,
    category: "home",
    rating: 4.1,
    inStock: true,
  },
  {
    id: 12,
    name: "Plant Pot Set",
    price: 28,
    category: "home",
    rating: 4.0,
    inStock: false,
  },
];

export async function GET(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "electronics";
  const sortBy = searchParams.get("sortBy") || "name";
  const limit = parseInt(searchParams.get("limit") || "10");

  // Filter products by category
  let filteredProducts = products.filter(
    (product) => product.category === category
  );

  // Sort products
  switch (sortBy) {
    case "price":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "date":
      // For demo purposes, sort by id (simulating date)
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
    default:
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Apply limit
  filteredProducts = filteredProducts.slice(0, limit);

  return NextResponse.json({
    products: filteredProducts,
    filters: { category, sortBy, limit },
    total: filteredProducts.length,
    timestamp: new Date().toISOString(),
  });
}
