
import React from 'react';

const iconProps = {
  className: "w-6 h-6 mx-auto",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowUp = () => (
  <svg {...iconProps}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
);
export const ArrowDown = () => (
  <svg {...iconProps}><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
);
export const ArrowLeft = () => (
  <svg {...iconProps}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);
export const ArrowRight = () => (
  <svg {...iconProps}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);
