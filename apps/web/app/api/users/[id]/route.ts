import { NextRequest, NextResponse } from "next/server";

// Mock users data
const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    age: 30,
    role: "Engineer",
    department: "Engineering",
  },
  {
    id: 2,
    name: "Alice Johnson",
    email: "alice@example.com",
    age: 28,
    role: "Designer",
    department: "Design",
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    age: 35,
    role: "Manager",
    department: "Operations",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@example.com",
    age: 26,
    role: "Developer",
    department: "Engineering",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael@example.com",
    age: 32,
    role: "Architect",
    department: "Engineering",
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { id } = await params;
  const userId = parseInt(id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user,
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substring(2, 11),
  });
}
