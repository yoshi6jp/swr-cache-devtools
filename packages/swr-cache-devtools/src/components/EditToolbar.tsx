import React from "react";
import { COLORS } from "../styles";

interface EditToolbarProps {
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  onEnterEditMode: () => void;
  onExitEditMode: () => void;
  onResetChanges: () => void;
  onApplyChanges: () => void;
}

export const EditToolbar: React.FC<EditToolbarProps> = React.memo(
  ({
    isEditMode,
    hasUnsavedChanges,
    onEnterEditMode,
    onExitEditMode,
    onResetChanges,
    onApplyChanges,
  }) => {
    if (isEditMode) {
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onExitEditMode}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              backgroundColor: COLORS.secondary,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Exit Edit
          </button>
          {hasUnsavedChanges && (
            <>
              <button
                onClick={onResetChanges}
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  backgroundColor: COLORS.warning,
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
              <button
                onClick={onApplyChanges}
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  backgroundColor: COLORS.success,
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={onEnterEditMode}
        style={{
          padding: "4px 8px",
          fontSize: "12px",
          backgroundColor: COLORS.primary,
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Edit Mode
      </button>
    );
  }
);

EditToolbar.displayName = "EditToolbar";
