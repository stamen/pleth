import React, { useRef, useEffect } from 'react';

// For HiDPI Canvas rendering.
// Makes it look still crisp even after browser zoom in.
const defaultScaleFactor = 2;

export const PolygonsLayer = ({
  width,
  height,
  scaleFactor = defaultScaleFactor,
}) => {
  const ref = useRef();
  width *= scaleFactor;
  height *= scaleFactor;

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
  }, [width, height]);

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
