import React, { useRef, useEffect } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';

const projection = geoAlbersUsa(); //.scale(1300).translate([487.5, 305])

// For HiDPI Canvas rendering.
// Makes it look still crisp even after browser zoom in.
const defaultScaleFactor = 2;

export const PolygonsLayer = ({
  width,
  height,
  geometriesForActiveRegion,
  scaleFactor = defaultScaleFactor,
}) => {
  const ref = useRef();
  width *= scaleFactor;
  height *= scaleFactor;

  useEffect(() => {
    const context = ref.current.getContext('2d');
    const path = geoPath(projection, context);
    context.beginPath();
    path(geometriesForActiveRegion);
    context.stroke();
    console.log(geometriesForActiveRegion);
  }, [width, height, geometriesForActiveRegion]);

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
