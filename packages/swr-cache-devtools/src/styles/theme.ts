import React from "react";
import { Theme } from "../types";

export const THEME_COLORS = {
  light: {
    background: "#ffffff",
    text: "#000000",
    border: "#e1e1e1",
    hover: "#f0f0f0",
    secondary: "#f8f9fa",
    accent: "#0070f3",
    mutedText: "#666666",
    jsonViewBg: "#f8f9fa",
  },
  dark: {
    background: "#1a1a1a",
    text: "#ffffff",
    border: "#333333",
    hover: "#333333",
    secondary: "#2d2d2d",
    accent: "#0070f3",
    mutedText: "#999999",
    jsonViewBg: "#2d2d2d",
  },
} as const;

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
} as const;

export const COLORS = {
  primary: "#0070f3",
  danger: "#dc3545",
  success: "#28a745",
  warning: "#f39c12",
  secondary: "#6c757d",
} as const;

export const getThemeColors = (theme: Theme) => {
  if (theme === "auto") {
    // Auto theme detection could be implemented here
    return THEME_COLORS.light;
  }
  return THEME_COLORS[theme];
};
