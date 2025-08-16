import React from "react";
import { Theme } from "../types";
import { getThemeColors, COLORS } from "../styles";

interface CacheKeyListProps {
  theme: Theme;
  cacheKeys: string[];
  filteredCacheKeys: string[];
  selectedKey: string | null;
  searchTerm: string;
  refreshingKeys: Set<string>;
  isRefreshingAll: boolean;
  onSearchChange: (term: string) => void;
  onKeySelect: (key: string) => void;
  onDeleteCache: (key: string) => void;
  onRefreshCache: (key: string) => void;
  onRefreshCacheList: () => void;
  getKeyData: (key: string) => any;
}

export const CacheKeyList: React.FC<CacheKeyListProps> = React.memo(
  ({
    theme,
    cacheKeys,
    filteredCacheKeys,
    selectedKey,
    searchTerm,
    refreshingKeys,
    isRefreshingAll,
    onSearchChange,
    onKeySelect,
    onDeleteCache,
    onRefreshCache,
    onRefreshCacheList,
    getKeyData,
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "16px" }}>
            Cache Keys ({filteredCacheKeys.length}/{cacheKeys.length})
          </h3>
          <button
            onClick={onRefreshCacheList}
            disabled={isRefreshingAll}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              backgroundColor: isRefreshingAll
                ? COLORS.secondary
                : COLORS.primary,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isRefreshingAll ? "not-allowed" : "pointer",
              opacity: isRefreshingAll ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isRefreshingAll ? "🔄" : "🔄"}{" "}
            {isRefreshingAll ? "Refreshing..." : "Refresh List"}
          </button>
        </div>

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
            {cacheKeys.length === 0
              ? "No cache found"
              : "No matching keys found"}
          </p>
        ) : (
          <div style={{ maxHeight: "400px", overflow: "auto" }}>
            {filteredCacheKeys.map((key) => {
              const keyData = getKeyData(key);
              const hasError = keyData && keyData.error;
              const isRefreshing = refreshingKeys.has(key);

              return (
                <div
                  key={key}
                  style={{
                    padding: "8px",
                    marginBottom: "4px",
                    backgroundColor:
                      selectedKey === key ? themeColors.hover : "transparent",
                    border: `1px solid ${
                      selectedKey === key
                        ? COLORS.primary
                        : hasError
                          ? COLORS.danger
                          : themeColors.border
                    }`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    wordBreak: "break-all",
                    borderLeft: hasError
                      ? `4px solid ${COLORS.danger}`
                      : undefined,
                    opacity: isRefreshing ? 0.7 : 1,
                  }}
                  onClick={() => onKeySelect(key)}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {isRefreshing ? (
                      <span style={{ color: COLORS.warning }}>🔄</span>
                    ) : hasError ? (
                      <span style={{ color: COLORS.danger }}>❌</span>
                    ) : (
                      <span style={{ color: COLORS.success }}>✅</span>
                    )}
                    {key}
                    {isRefreshing && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: COLORS.warning,
                          fontStyle: "italic",
                        }}
                      >
                        Refreshing...
                      </span>
                    )}
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
                      disabled={isRefreshing}
                      style={{
                        padding: "2px 6px",
                        fontSize: "10px",
                        backgroundColor: isRefreshing
                          ? COLORS.secondary
                          : COLORS.success,
                        color: "white",
                        border: "none",
                        borderRadius: "2px",
                        cursor: isRefreshing ? "not-allowed" : "pointer",
                        opacity: isRefreshing ? 0.6 : 1,
                      }}
                    >
                      {isRefreshing ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

CacheKeyList.displayName = "CacheKeyList";
