import { NextResponse } from "next/server";

// Global counter to simulate real-time data
let globalCounter = 1;

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Increment counter each time
  globalCounter++;

  const data = {
    timestamp: new Date().toISOString(),
    randomValue: Math.floor(Math.random() * 1000),
    counter: globalCounter,
    status: Math.random() > 0.3 ? "active" : "inactive",
    temperature: Math.floor(Math.random() * 40) + 10, // 10-50°C
    cpu: Math.floor(Math.random() * 100), // 0-100%
    memory: Math.floor(Math.random() * 100), // 0-100%
  };

  return NextResponse.json(data);
}
