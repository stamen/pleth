import React, { useRef, useLayoutEffect } from 'react';
import { geoPath } from 'd3-geo';

// For HiDPI Canvas rendering.
// Makes it look still crisp even after browser zoom in.
const defaultScaleFactor = 2;

export const PolygonsLayer = ({
  width,
  height,
  geometriesForActiveRegion,
  scaleFactor = defaultScaleFactor,
  projection,
}) => {
  const ref = useRef();
  width *= scaleFactor;
  height *= scaleFactor;

  // Adjust the scale and translate for this layer's resolution.
  projection.scale((width + height) / 2).translate([width / 2, height / 2]);

  useLayoutEffect(() => {
    if (!geometriesForActiveRegion) return;
    const context = ref.current.getContext('2d');
    const path = geoPath(projection, context);
    context.beginPath();
    path(geometriesForActiveRegion);
    context.stroke();
  }, [width, height, geometriesForActiveRegion, projection]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{
        width: width / scaleFactor + 'px',
        height: height / scaleFactor + 'px',
      }}
    />
  );
};
