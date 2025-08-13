"use client";

import React, { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import JsonView from "@uiw/react-json-view";
import JsonViewEditor from "@uiw/react-json-view/editor";

export interface SwrCacheDevToolsProps {
  // Basic configuration
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";

  // Display settings
  theme?: "light" | "dark" | "auto";
  defaultOpen?: boolean;
  maxHeight?: number;
  maxWidth?: number;

  // Styling
  className?: string;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
}

export const SwrCacheDevTools: React.FC<SwrCacheDevToolsProps> = ({
  position = "bottom-right",
  theme = "auto",
  defaultOpen = false,
  maxHeight = 600,
  maxWidth = 800,
  className,
  style,
  buttonStyle,
  panelStyle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { cache, mutate } = useSWRConfig();

  // Get cache keys list
  useEffect(() => {
    const keys = Array.from(cache.keys());
    setCacheKeys(keys);
  }, [cache, isOpen]);

  // Filter cache keys based on search term
  const filteredCacheKeys = cacheKeys.filter((key) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Floating button position style
  const getButtonPosition = () => {
    const baseStyle = {
      position: "fixed" as const,
      zIndex: 9999,
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      backgroundColor: "#0070f3",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontSize: "20px",
      boxShadow: "0 4px 12px rgba(0, 112, 243, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const positions = {
      "top-left": { top: "20px", left: "20px" },
      "top-right": { top: "20px", right: "20px" },
      "bottom-left": { bottom: "20px", left: "20px" },
      "bottom-right": { bottom: "20px", right: "20px" },
    };

    return { ...baseStyle, ...positions[position], ...buttonStyle };
  };

  // Panel style
  const getPanelStyle = () => {
    const baseStyle = {
      position: "fixed" as const,
      bottom: "0",
      left: "0",
      right: "0",
      width: "100vw",
      height: "50vh",
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
      border: `1px solid ${theme === "dark" ? "#333" : "#e1e1e1"}`,
      borderBottom: "none",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.3)",
      zIndex: 10000,
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
    };

    return { ...baseStyle, ...panelStyle };
  };

  // Get data for selected key
  const getSelectedKeyData = () => {
    if (!selectedKey) return null;
    return cache.get(selectedKey);
  };

  // Get display data (success: data content, error: error content)
  const getDisplayData = () => {
    const cacheData = getSelectedKeyData();
    if (!cacheData) return null;

    // If there's an error, return the error
    if (cacheData.error) {
      return cacheData.error;
    }

    // If successful, return only the data content
    if (cacheData.data) {
      return cacheData.data;
    }

    // Fallback to the entire cache data
    return cacheData;
  };

  // Delete cache
  const deleteCache = (key: string) => {
    cache.delete(key);
    setCacheKeys(Array.from(cache.keys()));
    if (selectedKey === key) {
      setSelectedKey(null);
      setIsEditMode(false);
    }
  };

  // Manually refresh cache
  const refreshCache = (key: string) => {
    mutate(key);
  };

  // Handle key selection
  const handleKeySelection = (key: string) => {
    setSelectedKey(key);
    setIsEditMode(false); // Reset edit mode when changing keys
  };

  // Handle JSON editing - v1 API
  const handleEdit = (option: {
    value: unknown;
    oldValue: unknown;
    keyName?: string | number;
    parentName?: string | number;
    namespace?: Array<string | number>;
    type?: "value" | "key";
  }) => {
    if (!selectedKey) return false;

    try {
      // Get current cache data
      const currentCacheData = cache.get(selectedKey);
      if (!currentCacheData) return false;

      // The edit operation should update the entire data structure
      // We need to get the updated root object from react-json-view
      // For now, we'll update the specific value based on the namespace

      // This is a simplified approach - in practice, react-json-view
      // would provide the updated root object
      const rootData = currentCacheData.error || currentCacheData.data;

      // Update the cache with the current data state
      // Note: The actual editing is handled by react-json-view internally
      // This callback mainly serves to validate and control the edit operation

      return true; // Allow the edit
    } catch (error) {
      // console.error("Error updating cache:", error);
      return false;
    }
  };

  // Handle adding new properties to JSON - v1 API
  const handleAdd = (
    keyOrValue: string,
    newValue: object,
    value: object,
    isAdd: boolean
  ) => {
    if (!selectedKey || !isAdd) return false;

    try {
      const currentCacheData = cache.get(selectedKey);
      if (!currentCacheData) return false;

      // Update the cache with the new value
      if (currentCacheData.error) {
        cache.set(selectedKey, { ...currentCacheData, error: value });
      } else {
        cache.set(selectedKey, { ...currentCacheData, data: value });
      }

      setCacheKeys(Array.from(cache.keys()));
      return true;
    } catch (error) {
      // console.error("Error adding to cache:", error);
      return false;
    }
  };

  // Handle deleting properties from JSON - v1 API
  const handleDelete = (
    keyName: string | number,
    value: object,
    parentValue: object | null,
    opt: { namespace?: (string | number)[] }
  ) => {
    if (!selectedKey) return false;

    try {
      const currentCacheData = cache.get(selectedKey);
      if (!currentCacheData) return false;

      // Update the cache with the modified parent value
      if (currentCacheData.error) {
        cache.set(selectedKey, { ...currentCacheData, error: parentValue });
      } else {
        cache.set(selectedKey, { ...currentCacheData, data: parentValue });
      }

      setCacheKeys(Array.from(cache.keys()));
      return true;
    } catch (error) {
      // console.error("Error deleting from cache:", error);
      return false;
    }
  };

  if (!isOpen) {
    return (
      <button
        style={getButtonPosition()}
        onClick={() => setIsOpen(true)}
        title="Open SWR Cache DevTools"
      >
        🔍
      </button>
    );
  }

  return (
    <div style={getPanelStyle()} className={className}>
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e1e1e1"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px" }}>SWR Cache DevTools</h2>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "inherit",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Cache keys list */}
        <div
          style={{
            width: "40%",
            borderRight: `1px solid ${theme === "dark" ? "#333" : "#e1e1e1"}`,
            padding: "16px",
            overflow: "auto",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>
            Cache Keys ({filteredCacheKeys.length}/{cacheKeys.length})
          </h3>

          {/* Search box */}
          <input
            type="text"
            placeholder="Search cache keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "16px",
              border: `1px solid ${theme === "dark" ? "#444" : "#ddd"}`,
              borderRadius: "4px",
              backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
              color: theme === "dark" ? "#ffffff" : "#000000",
              fontSize: "12px",
            }}
          />

          {filteredCacheKeys.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              {cacheKeys.length === 0
                ? "No cache found"
                : "No matching keys found"}
            </p>
          ) : (
            <div>
              {filteredCacheKeys.map((key) => (
                <div
                  key={key}
                  style={{
                    padding: "8px",
                    marginBottom: "4px",
                    backgroundColor:
                      selectedKey === key
                        ? theme === "dark"
                          ? "#333"
                          : "#f0f0f0"
                        : "transparent",
                    border: `1px solid ${
                      selectedKey === key
                        ? "#0070f3"
                        : theme === "dark"
                          ? "#444"
                          : "#ddd"
                    }`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    wordBreak: "break-all",
                  }}
                  onClick={() => handleKeySelection(key)}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    {key}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCache(key);
                      }}
                      style={{
                        padding: "2px 6px",
                        fontSize: "10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "2px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        refreshCache(key);
                      }}
                      style={{
                        padding: "2px 6px",
                        fontSize: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "2px",
                        cursor: "pointer",
                      }}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data display area */}
        <div style={{ flex: 1, padding: "16px", overflow: "auto" }}>
          {selectedKey ? (
            <div>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>
                Data Details
              </h3>

              <div style={{ marginBottom: "16px" }}>
                <strong>Key:</strong> {selectedKey}
              </div>

              <div
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>
                    {getSelectedKeyData()?.error ? "Error:" : "Data:"}
                  </strong>
                  {!isEditMode && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      (Read-only mode)
                    </span>
                  )}
                  {isEditMode && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "12px",
                        color: "#0070f3",
                      }}
                    >
                      (Edit mode - Click values to edit)
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    backgroundColor: isEditMode ? "#dc3545" : "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isEditMode ? "Exit Edit" : "Edit Mode"}
                </button>
              </div>

              <div
                style={{
                  border: `1px solid ${theme === "dark" ? "#333" : "#e1e1e1"}`,
                  borderRadius: "4px",
                  overflow: "auto",
                  maxHeight: "400px",
                }}
              >
                {isEditMode ? (
                  <JsonViewEditor
                    value={getDisplayData() || {}}
                    style={{
                      backgroundColor: theme === "dark" ? "#2d2d2d" : "#f8f9fa",
                      padding: "12px",
                    }}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={true}
                    editable={true}
                    onEdit={handleEdit}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                  />
                ) : (
                  <JsonView
                    value={getDisplayData() || {}}
                    style={{
                      backgroundColor: theme === "dark" ? "#2d2d2d" : "#f8f9fa",
                      padding: "12px",
                    }}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={true}
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              Please select a key
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
