import React from "react";
import { Position } from "../types";
import { SPACING } from "./theme";

export const getButtonPosition = (
  position: Position,
  buttonStyle?: React.CSSProperties
): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#070707",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "32px",
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

export const getPanelStyle = (
  theme: "light" | "dark",
  maxHeight?: number,
  maxWidth?: number,
  panelStyle?: React.CSSProperties
): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    width: maxWidth ? `${maxWidth}px` : "100vw",
    height: maxHeight ? `${maxHeight}px` : "50vh",
    maxWidth: maxWidth ? `${maxWidth}px` : "100vw",
    maxHeight: maxHeight ? `${maxHeight}px` : "80vh",
    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#000000",
    border: `1px solid ${theme === "dark" ? "#333" : "#e1e1e1"}`,
    borderBottom: "none",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.3)",
    zIndex: 10000,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  // Center the panel horizontally if maxWidth is specified
  if (maxWidth) {
    baseStyle.left = "50%";
    baseStyle.right = "auto";
    baseStyle.transform = "translateX(-50%)";
  }

  return { ...baseStyle, ...panelStyle };
};
