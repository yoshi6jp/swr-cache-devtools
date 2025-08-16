"use client";

import React, { useState } from "react";
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
  style,
  buttonStyle,
  panelStyle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const themeColors = getThemeColors(theme);

  // SWR Cache management
  const {
    cacheKeys,
    filteredCacheKeys,
    selectedKey,
    searchTerm,
    setSearchTerm,
    getSelectedKeyData,
    getDisplayData,
    deleteCache,
    refreshCache,
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

  // Handle key selection with edit mode reset
  const handleKeySelectionWithReset = (key: string) => {
    handleKeySelection(key);
    resetForNewKey();
  };

  // Handle edit mode entry
  const handleEnterEditMode = () => {
    const currentData = getDisplayData();
    enterEditMode(currentData);
  };

  // Handle apply changes
  const handleApplyChanges = () => {
    if (selectedKey) {
      applyChanges(selectedKey, mutate);
    }
  };

  if (!isOpen) {
    return (
      <FloatingButton
        position={position}
        buttonStyle={buttonStyle}
        onClick={() => setIsOpen(true)}
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
        <CacheKeyList
          theme={theme}
          cacheKeys={cacheKeys}
          filteredCacheKeys={filteredCacheKeys}
          selectedKey={selectedKey}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onKeySelect={handleKeySelectionWithReset}
          onDeleteCache={deleteCache}
          onRefreshCache={refreshCache}
        />

        {/* Data display area */}
        <DataViewer
          theme={theme}
          selectedKey={selectedKey}
          cacheData={getSelectedKeyData()}
          displayData={getDisplayData()}
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
