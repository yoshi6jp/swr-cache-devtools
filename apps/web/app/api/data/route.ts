import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const errorType = searchParams.get("errorType") || "success";
  const retryCount = parseInt(searchParams.get("retryCount") || "0");

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Simulate different error types
  switch (errorType) {
    case "500":
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Something went wrong on the server",
        },
        { status: 500 }
      );

    case "404":
      return NextResponse.json(
        { error: "Not Found", message: "The requested resource was not found" },
        { status: 404 }
      );

    case "timeout":
      // Simulate timeout by taking a very long time
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return NextResponse.json({ message: "This should timeout" });

    case "network":
      // Simulate network error
      return NextResponse.json(
        { error: "Network Error", message: "Failed to connect to the server" },
        { status: 502 }
      );

    default:
      // Success case
      return NextResponse.json({
        message: "Data retrieved successfully",
        data: {
          id: 1,
          content: "This is successful data",
          retryCount,
          timestamp: new Date().toISOString(),
        },
        status: "success",
      });
  }
}
