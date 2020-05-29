import React, { useRef, useEffect } from 'react';

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
    const ctx = ref.current.getContext('2d');
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
