import React, { useRef, useEffect } from 'react';

export const PolygonsLayer = ({ width, height }) => {
  const ref = useRef();

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
  }, [width, height]);

  return <canvas ref={ref} width={width} height={height} />;
};
