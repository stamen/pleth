import React, { useRef, useLayoutEffect } from 'react';
import { geoPath } from 'd3-geo';

// For HiDPI Canvas rendering.
// Makes it look still crisp even after browser zoom in.
const defaultScaleFactor = 2;

export const PolygonsLayer = ({
  width,
  height,
  geometries,
  scaleFactor = defaultScaleFactor,
  projection,
}) => {
  const ref = useRef();
  width *= scaleFactor;
  height *= scaleFactor;

  useLayoutEffect(() => {
    if (!geometries) return;

    // Adjust the scale and translate for this layer's resolution.
    const oldScale = projection.scale();
    const oldTranslate = projection.translate();
    projection
      .scale(oldScale * scaleFactor)
      .translate([
        oldTranslate[0] * scaleFactor,
        oldTranslate[1] * scaleFactor,
      ]);

    // Draw the shapes.
    const context = ref.current.getContext('2d');
    const path = geoPath(projection, context);
    context.beginPath();
    path(geometries);
    context.stroke();

    // Restore the old scale and translate.
    projection.scale(oldScale).translate(oldTranslate);
  }, [width, height, geometries, projection, scaleFactor]);

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
