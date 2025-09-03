import React from "react";

/**
 * Reusable loader spinner with optional text.
 *
 * Props:
 *  - size: "sm" | "md" | "lg"
 *  - color: tailwind color (default "white")
 *  - text: optional string next to spinner
 *  - className: extra wrapper classes
 */
export default function Loader({
  size = "md",
  color = "white",
  text = "",
  className = "",
}) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className={`
          ${sizeMap[size]}
          rounded-full
          border-${color}
          border-t-transparent
          animate-spin
        `}
      />
      {text ? (
        <span className="text-sm text-gray-200 select-none">{text}</span>
      ) : null}
    </div>
  );
}
