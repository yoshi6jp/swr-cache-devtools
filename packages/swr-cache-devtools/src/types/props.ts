import React from "react";

export interface SwrCacheDevToolsProps {
  // Basic configuration
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";

  // Display settings
  theme?: "light" | "dark" | "auto";
  defaultOpen?: boolean;
  maxHeight?: number;
  maxWidth?: number;

  // Styling
  className?: string;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
}

export interface CacheKeyData {
  data?: any;
  error?: any;
  isLoading?: boolean;
  isValidating?: boolean;
  [key: string]: any;
}

export type Theme = "light" | "dark" | "auto";
export type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
