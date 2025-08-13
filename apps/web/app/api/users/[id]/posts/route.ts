import { NextRequest, NextResponse } from "next/server";

// Mock posts data
const posts = [
  {
    id: 1,
    userId: 1,
    title: "TypeScript Type Safety Best Practices",
    body: "By using TypeScript, you can detect type errors at compile time and improve code quality...",
    category: "Programming",
    tags: ["typescript", "development", "best-practices"],
  },
  {
    id: 2,
    userId: 1,
    title: "Effective Use of React Hooks",
    body: "Properly using Hooks like useState and useEffect can improve component performance...",
    category: "React",
    tags: ["react", "hooks", "frontend"],
  },
  {
    id: 3,
    userId: 2,
    title: "Next.js Performance Optimization",
    body: "How to improve performance using image optimization and SSR/SSG techniques...",
    category: "Next.js",
    tags: ["nextjs", "performance", "optimization"],
  },
  {
    id: 4,
    userId: 3,
    title: "Data Fetching with SWR",
    body: "Using SWR enables efficient data fetching and caching for React applications...",
    category: "SWR",
    tags: ["swr", "data-fetching", "caching"],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { id } = await params;
  const userId = parseInt(id);
  const userPosts = posts.filter((post) => post.userId === userId);

  return NextResponse.json({
    posts: userPosts,
    userId,
    total: userPosts.length,
    timestamp: new Date().toISOString(),
  });
}
