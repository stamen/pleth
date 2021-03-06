import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { geoPath } from 'd3-geo';

// For HiDPI Canvas rendering.
// Makes it look still crisp even after browser zoom in.
const defaultScaleFactor = 2;

export const PolygonsLayer = ({
  fillStyle,
  strokeStyle,
  scaleFactor = defaultScaleFactor,
}) => {
  const Component = ({ width, height, geometries, projection }) => {
    const ref = useRef();
    width *= scaleFactor;
    height *= scaleFactor;

    // Set up the D3 path instance with the current projection.
    const path = useMemo(() => geoPath(projection), [projection]);

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
      path.context(context);
      geometries.features.forEach((feature) => {
        context.beginPath();
        path(feature);
        if (fillStyle) {
          context.fillStyle = fillStyle(feature);
          context.fill();
        }
        if (strokeStyle) {
          context.strokeStyle = strokeStyle;
          context.stroke();
        }
      });
      path.context(null);

      // Restore the old scale and translate.
      projection.scale(oldScale).translate(oldTranslate);
    }, [width, height, geometries, projection, path]);

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
  return Component;
};
