import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 350));

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "public";

  const publicSettings = {
    theme: "light",
    language: "en",
    notifications: true,
    autoSave: true,
    itemsPerPage: 15,
    showTutorial: false,
  };

  const sensitiveSettings = {
    apiKey: "sk-demo-***",
    email: "user@example.com",
    permissions: ["read", "write"],
    securityLevel: "high",
    twoFactorEnabled: true,
    lastLogin: new Date().toISOString(),
  };

  const settings = type === "sensitive" ? sensitiveSettings : publicSettings;

  return NextResponse.json({
    type,
    settings,
    count: Object.keys(settings).length,
    timestamp: new Date().toISOString(),
  });
}
