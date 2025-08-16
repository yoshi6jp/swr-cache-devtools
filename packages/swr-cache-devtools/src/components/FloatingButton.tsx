import React from "react";
import { SiSwr } from "react-icons/si";
import { Position } from "../types";
import { getButtonPosition } from "../styles";

interface FloatingButtonProps {
  position: Position;
  buttonStyle?: React.CSSProperties;
  onClick: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = React.memo(
  ({ position, buttonStyle, onClick }) => {
    return (
      <button
        style={getButtonPosition(position, buttonStyle)}
        onClick={onClick}
        title="Open SWR Cache DevTools"
      >
        <SiSwr />
      </button>
    );
  }
);

FloatingButton.displayName = "FloatingButton";
