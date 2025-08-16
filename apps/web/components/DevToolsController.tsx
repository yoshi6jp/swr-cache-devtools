"use client";

import React, { useState } from "react";
import { SwrCacheDevTools, SwrCacheDevToolsProps } from "swr-cache-devtools";
import { Button } from "rsc-daisyui";

interface DevToolsControllerProps {
  children: React.ReactNode;
}

export const DevToolsController: React.FC<DevToolsControllerProps> = ({
  children,
}) => {
  const [devToolsProps, setDevToolsProps] = useState<SwrCacheDevToolsProps>({
    position: "bottom-right",
    theme: "auto",
    maxHeight: undefined,
    maxWidth: undefined,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const updateProp = <K extends keyof SwrCacheDevToolsProps>(
    key: K,
    value: SwrCacheDevToolsProps[K]
  ) => {
    setDevToolsProps((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      {/* Settings Header */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-base-content">
                DevTools Settings
              </h2>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="btn btn-sm btn-ghost"
              >
                {isSettingsOpen ? "Hide" : "Show"} Settings
              </button>
            </div>
            <div className="text-sm text-base-content/70">
              Current Position: {devToolsProps.position} | Theme:{" "}
              {devToolsProps.theme}
            </div>
          </div>

          {isSettingsOpen && (
            <div className="mt-4 p-4 bg-base-100 rounded-lg border border-base-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Position */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Position</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={devToolsProps.position}
                    onChange={(e) =>
                      updateProp(
                        "position",
                        e.target.value as SwrCacheDevToolsProps["position"]
                      )
                    }
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                {/* Theme */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Theme</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={devToolsProps.theme}
                    onChange={(e) =>
                      updateProp(
                        "theme",
                        e.target.value as SwrCacheDevToolsProps["theme"]
                      )
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                {/* Max Height */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Max Height (px)
                    </span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered input-sm"
                    value={devToolsProps.maxHeight}
                    min="300"
                    max="1000"
                    step="50"
                    onChange={(e) =>
                      updateProp("maxHeight", parseInt(e.target.value))
                    }
                  />
                </div>

                {/* Max Width */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Max Width (px)
                    </span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered input-sm"
                    value={devToolsProps.maxWidth}
                    min="400"
                    max="1200"
                    step="50"
                    onChange={(e) =>
                      updateProp("maxWidth", parseInt(e.target.value))
                    }
                  />
                </div>

                {/* Reset Button */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Reset</span>
                  </label>
                  <Button
                    size="sm"
                    outline
                    block
                    onClick={() =>
                      setDevToolsProps({
                        position: "bottom-right",
                        theme: "auto",
                        maxHeight: 600,
                        maxWidth: 800,
                      })
                    }
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>

              {/* Current Configuration Display */}
              <div className="mt-4 p-3 bg-base-200 rounded">
                <h4 className="font-medium text-sm mb-2">
                  Current Configuration:
                </h4>
                <pre className="text-xs text-base-content/80">
                  {JSON.stringify(devToolsProps, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {children}

      {/* DevTools with dynamic props */}
      <SwrCacheDevTools {...devToolsProps} />
    </>
  );
};
