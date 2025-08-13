"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, Badge } from "rsc-daisyui";
import {
  FaCubes,
  FaList,
  FaArrowsRotate,
  FaGears,
  FaTriangleExclamation,
  FaPlay,
  FaDatabase,
  FaBolt,
} from "react-icons/fa6";

const demoTabs = [
  {
    href: "/",
    label: "Basic Operations",
    icon: <FaCubes className="w-4 h-4" />,
    color: "info" as const,
    description: "Basic SWR usage patterns and cache inspection",
  },
  {
    href: "/array-keys",
    label: "Array Keys",
    icon: <FaList className="w-4 h-4" />,
    color: "success" as const,
    description: "SWR patterns using array-form keys",
  },
  {
    href: "/real-time",
    label: "Real-time",
    icon: <FaArrowsRotate className="w-4 h-4" />,
    color: "warning" as const,
    description: "Real-time updates and cache synchronization",
  },
  {
    href: "/advanced",
    label: "Advanced Features",
    icon: <FaGears className="w-4 h-4" />,
    color: "secondary" as const,
    description: "Advanced features like conditional fetching and dependencies",
  },
  {
    href: "/error-handling",
    label: "Error Handling",
    icon: <FaTriangleExclamation className="w-4 h-4" />,
    color: "error" as const,
    description: "Error handling and retry mechanisms demo",
  },
];

export function Navigation() {
  const pathname = usePathname();

  const activeDemo = demoTabs.find((tab) => tab.href === pathname);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card className="bg-base-200/50">
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            {demoTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href}>
                  <button
                    className={`
                      btn btn-sm gap-2 transition-all duration-200
                      ${
                        isActive
                          ? `btn-${tab.color} btn-active`
                          : "btn-ghost hover:btn-outline"
                      }
                    `}
                  >
                    {tab.icon}
                    {tab.label}
                    {isActive && (
                      <Badge size="xs" color={tab.color} className="ml-1">
                        ACTIVE
                      </Badge>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Active Demo Description */}
      {activeDemo && (
        <Card className="bg-gradient-to-r from-base-200 to-base-300 border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full bg-${activeDemo.color}/20 text-${activeDemo.color}`}
              >
                {activeDemo.icon}
              </div>
              <div>
                <h2 className="card-title text-xl flex items-center gap-2">
                  {activeDemo.label}
                  <Badge color={activeDemo.color} size="sm">
                    <FaPlay className="w-3 h-3 mr-1" />
                    DEMO
                  </Badge>
                </h2>
                <p className="text-base-content/70 mt-1">
                  {activeDemo.description}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-info/10 border border-info/20">
        <div className="card-body">
          <div className="flex items-start gap-3">
            <FaDatabase className="w-5 h-5 text-info mt-1" />
            <div>
              <h3 className="font-semibold text-info mb-2 flex items-center gap-2">
                <FaBolt className="w-4 h-4" />
                How to use SWR Cache DevTools
              </h3>
              <p className="text-sm text-base-content/70">
                When you run each demo, the SWR cache state will be displayed in
                real-time in the DevTools at the bottom of the page. You can
                enable edit mode to directly modify cache values.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
