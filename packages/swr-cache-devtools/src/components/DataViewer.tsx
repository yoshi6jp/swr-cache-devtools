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
  hasError: boolean;
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

export const DataViewer: React.FC<DataViewerProps> = React.memo(
  ({
    theme,
    selectedKey,
    cacheData,
    displayData,
    hasError,
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

        {hasError && cacheData && (
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                padding: "12px",
                backgroundColor: `${COLORS.danger}20`,
                border: `1px solid ${COLORS.danger}`,
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: COLORS.danger }}>Error Details:</strong>
              <div style={{ marginTop: "8px", fontSize: "12px" }}>
                {cacheData.error && typeof cacheData.error === "object" ? (
                  <div>
                    {cacheData.error.message && (
                      <div>
                        <strong>Message:</strong> {cacheData.error.message}
                      </div>
                    )}
                    {cacheData.error.status && (
                      <div>
                        <strong>Status:</strong> {cacheData.error.status}
                      </div>
                    )}
                    {cacheData.error.name && (
                      <div>
                        <strong>Type:</strong> {cacheData.error.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>{String(cacheData.error)}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error details section */}
        {hasError && cacheData?.error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: `${COLORS.danger}10`,
              border: `1px solid ${COLORS.danger}`,
              borderRadius: "4px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ color: COLORS.danger }}>
                ❌ Error Information:
              </strong>
            </div>
            <div style={{ fontSize: "12px", marginBottom: "4px" }}>
              <strong>Status:</strong> {cacheData.error.status || "Unknown"}
            </div>
            {cacheData.error.message && (
              <div style={{ fontSize: "12px", marginBottom: "4px" }}>
                <strong>Message:</strong> {cacheData.error.message}
              </div>
            )}
            {cacheData.error.statusText && (
              <div style={{ fontSize: "12px", marginBottom: "4px" }}>
                <strong>Status Text:</strong> {cacheData.error.statusText}
              </div>
            )}
            {cacheData.error.info && (
              <div style={{ fontSize: "12px" }}>
                <strong>Additional Info:</strong>{" "}
                {JSON.stringify(cacheData.error.info)}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong style={{ color: hasError ? COLORS.danger : "inherit" }}>
              {hasError ? "❌ Error:" : "✅ Data:"}
            </strong>
            {hasError && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "12px",
                  color: COLORS.danger,
                  fontWeight: "bold",
                }}
              >
                (SWR Error State)
              </span>
            )}
            {!hasError && !isEditMode && !hasUnsavedChanges && (
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

          {!hasError && (
            <EditToolbar
              isEditMode={isEditMode}
              hasUnsavedChanges={hasUnsavedChanges}
              onEnterEditMode={onEnterEditMode}
              onExitEditMode={onExitEditMode}
              onResetChanges={onResetChanges}
              onApplyChanges={onApplyChanges}
            />
          )}
        </div>

        {!hasError && (
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
        )}
      </div>
    );
  }
);

DataViewer.displayName = "DataViewer";
