import React from "react";
import JsonView from "@uiw/react-json-view";
import JsonViewEditor from "@uiw/react-json-view/editor";
import { Theme } from "../types";
import { getThemeColors, COLORS } from "../styles";
import { EditToolbar } from "./EditToolbar";

interface DataViewerProps {
  theme: Theme;
  selectedKey: string | null;
  cacheData: any;
  displayData: any;
  isEditMode: boolean;
  editedData: any;
  hasUnsavedChanges: boolean;
  onEnterEditMode: () => void;
  onExitEditMode: () => void;
  onResetChanges: () => void;
  onApplyChanges: () => void;
  onEdit: (option: any) => boolean;
  onAdd: (
    keyOrValue: string,
    newValue: object,
    value: object,
    isAdd: boolean
  ) => boolean;
  onDelete: (
    keyName: string | number,
    value: object,
    parentValue: object | null,
    opt: { namespace?: (string | number)[] }
  ) => boolean;
}

export const DataViewer: React.FC<DataViewerProps> = ({
  theme,
  selectedKey,
  cacheData,
  displayData,
  isEditMode,
  editedData,
  hasUnsavedChanges,
  onEnterEditMode,
  onExitEditMode,
  onResetChanges,
  onApplyChanges,
  onEdit,
  onAdd,
  onDelete,
}) => {
  const themeColors = getThemeColors(theme);

  if (!selectedKey) {
    return (
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: themeColors.mutedText,
          fontStyle: "italic",
        }}
      >
        Please select a key
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: "16px", overflow: "auto" }}>
      <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Data Details</h3>

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
          <strong>{cacheData?.error ? "Error:" : "Data:"}</strong>
          {!isEditMode && !hasUnsavedChanges && (
            <span
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                color: themeColors.mutedText,
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
                color: COLORS.primary,
              }}
            >
              (Edit mode - Click values to edit)
            </span>
          )}
          {!isEditMode && hasUnsavedChanges && (
            <span
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                color: COLORS.warning,
              }}
            >
              (Preview - Edited content)
            </span>
          )}
        </div>

        <EditToolbar
          isEditMode={isEditMode}
          hasUnsavedChanges={hasUnsavedChanges}
          onEnterEditMode={onEnterEditMode}
          onExitEditMode={onExitEditMode}
          onResetChanges={onResetChanges}
          onApplyChanges={onApplyChanges}
        />
      </div>

      <div
        style={{
          border: `1px solid ${themeColors.border}`,
          borderRadius: "4px",
          overflow: "auto",
          maxHeight: "400px",
        }}
      >
        {isEditMode ? (
          <JsonViewEditor
            value={editedData || displayData || {}}
            style={{
              backgroundColor: themeColors.jsonViewBg,
              padding: "12px",
            }}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            editable={true}
            onEdit={onEdit}
            onAdd={onAdd}
            onDelete={onDelete}
          />
        ) : (
          <JsonView
            value={hasUnsavedChanges ? editedData || {} : displayData || {}}
            style={{
              backgroundColor: themeColors.jsonViewBg,
              padding: "12px",
            }}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
          />
        )}
      </div>
    </div>
  );
};
