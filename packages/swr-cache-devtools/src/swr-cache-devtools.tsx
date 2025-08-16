"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useSWRConfig } from "swr";
import { SwrCacheDevToolsProps } from "./types";
import { getThemeColors, getPanelStyle } from "./styles";
import { useSwrCache, useEditMode } from "./hooks";
import { FloatingButton, CacheKeyList, DataViewer } from "./components";

export const SwrCacheDevTools: React.FC<SwrCacheDevToolsProps> = ({
  position = "bottom-right",
  theme = "auto",
  defaultOpen = false,
  maxHeight,
  maxWidth,
  className,
  buttonStyle,
  panelStyle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { cache } = useSWRConfig();

  // Memoize theme colors calculation
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);

  // SWR Cache management
  const {
    cacheKeys,
    filteredCacheKeys,
    selectedKey,
    searchTerm,
    refreshingKeys,
    isRefreshingAll,
    setSearchTerm,
    getSelectedKeyData,
    getDisplayData,
    hasError,
    deleteCache,
    refreshCache,
    refreshCacheList,
    handleKeySelection,
    mutate,
  } = useSwrCache(isOpen);

  // Edit mode management
  const {
    isEditMode,
    editedData,
    hasUnsavedChanges,
    enterEditMode,
    exitEditMode,
    resetChanges,
    applyChanges,
    handleEdit,
    handleAdd,
    handleDelete,
    resetForNewKey,
  } = useEditMode();

  // Memoize hasError result
  const hasErrorResult = useMemo(() => hasError(), [hasError]);

  // Memoized callback functions
  const handleKeySelectionWithReset = useCallback(
    (key: string) => {
      handleKeySelection(key);
      resetForNewKey();
    },
    [handleKeySelection, resetForNewKey]
  );

  const handleEnterEditMode = useCallback(() => {
    const currentData = getDisplayData();
    enterEditMode(currentData);
  }, [getDisplayData, enterEditMode]);

  const handleApplyChanges = useCallback(() => {
    if (selectedKey) {
      applyChanges(selectedKey, mutate);
    }
  }, [selectedKey, applyChanges, mutate]);

  const handleOpenPanel = useCallback(() => setIsOpen(true), []);

  const handleClosePanel = useCallback(() => setIsOpen(false), []);

  // Memoize getKeyData function
  const getKeyData = useCallback((key: string) => cache.get(key), [cache]);

  if (!isOpen) {
    return (
      <FloatingButton
        position={position}
        buttonStyle={buttonStyle}
        onClick={handleOpenPanel}
      />
    );
  }

  return (
    <div
      style={getPanelStyle(
        theme === "auto" ? "light" : theme,
        maxHeight,
        maxWidth,
        panelStyle
      )}
      className={className}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: `1px solid ${themeColors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px" }}>SWR Cache DevTools</h2>
        <button
          onClick={handleClosePanel}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "inherit",
            marginRight: "8px",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Cache keys list */}
        <CacheKeyList
          theme={theme}
          cacheKeys={cacheKeys}
          filteredCacheKeys={filteredCacheKeys}
          selectedKey={selectedKey}
          searchTerm={searchTerm}
          refreshingKeys={refreshingKeys}
          isRefreshingAll={isRefreshingAll}
          onSearchChange={setSearchTerm}
          onKeySelect={handleKeySelectionWithReset}
          onDeleteCache={deleteCache}
          onRefreshCache={refreshCache}
          onRefreshCacheList={refreshCacheList}
          getKeyData={getKeyData}
        />

        {/* Data display area */}
        <DataViewer
          theme={theme}
          selectedKey={selectedKey}
          cacheData={getSelectedKeyData()}
          displayData={getDisplayData()}
          hasError={hasErrorResult}
          isEditMode={isEditMode}
          editedData={editedData}
          hasUnsavedChanges={hasUnsavedChanges}
          onEnterEditMode={handleEnterEditMode}
          onExitEditMode={exitEditMode}
          onResetChanges={resetChanges}
          onApplyChanges={handleApplyChanges}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
