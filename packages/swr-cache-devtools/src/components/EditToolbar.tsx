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

export const EditToolbar: React.FC<EditToolbarProps> = ({
  isEditMode,
  hasUnsavedChanges,
  onEnterEditMode,
  onExitEditMode,
  onResetChanges,
  onApplyChanges,
}) => {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {!isEditMode && !hasUnsavedChanges && (
        <button
          onClick={onEnterEditMode}
          style={{
            padding: "6px 12px",
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
      )}
      {isEditMode && (
        <button
          onClick={onExitEditMode}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            backgroundColor: COLORS.danger,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Exit Edit
        </button>
      )}
      {!isEditMode && hasUnsavedChanges && (
        <>
          <button
            onClick={onResetChanges}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              backgroundColor: COLORS.secondary,
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
              padding: "6px 12px",
              fontSize: "12px",
              backgroundColor: COLORS.success,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Mutate
          </button>
        </>
      )}
    </div>
  );
};
