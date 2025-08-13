import { NextResponse } from "next/server";

export async function GET() {
  // Add delay to simulate real API
  await new Promise((resolve) => setTimeout(resolve, 300));

  const data = {
    key: "/api/users",
    data: "Sample data for /api/users",
    timestamp: new Date().toISOString(),
    random: Math.random(),
    message: "This is users API endpoint",
    status: "success",
    users: [
      {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        role: "admin",
        age: 30,
      },
      {
        id: 2,
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "user",
        age: 28,
      },
      {
        id: 3,
        name: "Bob Wilson",
        email: "bob@example.com",
        role: "user",
        age: 35,
      },
      {
        id: 4,
        name: "Emma Davis",
        email: "emma@example.com",
        role: "moderator",
        age: 26,
      },
      {
        id: 5,
        name: "Michael Brown",
        email: "michael@example.com",
        role: "developer",
        age: 32,
      },
    ],
    total: 5,
  };

  return NextResponse.json(data);
}
