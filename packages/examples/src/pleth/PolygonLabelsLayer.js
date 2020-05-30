import React from 'react';

export const PolygonLabelsLayer = ({ width, height }) => {
  return (
    <svg width={width} height={height}>
      <text
        x={width / 2}
        y={height / 2}
        text-anchor="middle"
        alignment-baseline="middle"
      >
        Hello SVG text!
      </text>
    </svg>
  );
};
