import React from "react";
import { Theme } from "../types";
import { getThemeColors, COLORS } from "../styles";

interface CacheKeyListProps {
  theme: Theme;
  cacheKeys: string[];
  filteredCacheKeys: string[];
  selectedKey: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onKeySelect: (key: string) => void;
  onDeleteCache: (key: string) => void;
  onRefreshCache: (key: string) => void;
}

export const CacheKeyList: React.FC<CacheKeyListProps> = ({
  theme,
  cacheKeys,
  filteredCacheKeys,
  selectedKey,
  searchTerm,
  onSearchChange,
  onKeySelect,
  onDeleteCache,
  onRefreshCache,
}) => {
  const themeColors = getThemeColors(theme);

  return (
    <div
      style={{
        width: "40%",
        borderRight: `1px solid ${themeColors.border}`,
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
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "16px",
          border: `1px solid ${theme === "dark" ? "#444" : "#ddd"}`,
          borderRadius: "4px",
          backgroundColor: themeColors.background,
          color: themeColors.text,
          fontSize: "12px",
        }}
      />

      {filteredCacheKeys.length === 0 ? (
        <p style={{ color: "#666", fontStyle: "italic" }}>
          {cacheKeys.length === 0 ? "No cache found" : "No matching keys found"}
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
                  selectedKey === key ? themeColors.hover : "transparent",
                border: `1px solid ${
                  selectedKey === key ? COLORS.primary : themeColors.border
                }`,
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                wordBreak: "break-all",
              }}
              onClick={() => onKeySelect(key)}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {key}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCache(key);
                  }}
                  style={{
                    padding: "2px 6px",
                    fontSize: "10px",
                    backgroundColor: COLORS.danger,
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
                    onRefreshCache(key);
                  }}
                  style={{
                    padding: "2px 6px",
                    fontSize: "10px",
                    backgroundColor: COLORS.success,
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
  );
};
