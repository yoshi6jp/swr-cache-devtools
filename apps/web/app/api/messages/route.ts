import { NextRequest, NextResponse } from "next/server";

// Mock messages data (in-memory store for demo)
let messages = [
  {
    id: 1,
    text: "Hello! Nice to meet you all.",
    user: "John Smith",
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 2,
    text: "It's a beautiful day today!",
    user: "Alice Johnson",
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: 3,
    text: "This demo app is amazing!",
    user: "Bob Wilson",
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: 4,
    text: "I can really understand SWR features now.",
    user: "Emma Davis",
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 5,
    text: "Real-time updates are so convenient!",
    user: "Michael Brown",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 250));

  return NextResponse.json({
    messages: messages.slice(-10), // Return last 10 messages
    total: messages.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Add new message
    const newMessage = {
      id: messages.length + 1,
      text: message.trim(),
      user: "Demo User",
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // Keep only last 50 messages
    if (messages.length > 50) {
      messages = messages.slice(-50);
    }

    return NextResponse.json({
      message: newMessage,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
