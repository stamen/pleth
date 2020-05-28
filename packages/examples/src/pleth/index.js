import React, { useRef, useEffect, useState } from 'react';
import { Wrapper, Layer } from './styles';

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length !== 1) {
        console.error('expected exactly one entry');
      }
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    const element = ref.current;
    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, [ref]);

  return dimensions;
};

const PlethBody = ({ width, height, layers }) =>
  layers.map(({ name, render }) => (
    <Layer key="name">{render({ width, height })}</Layer>
  ));

const Pleth = () => {
  const ref = useRef();
  const dimensions = useResizeObserver(ref);

  const layers = [
    {
      name: 'polygons',
      render: ({ width, height }) => {
        console.log({ width, height });
        return <canvas width={width} height={height} />;
      },
    },
  ];

  return (
    <Wrapper ref={ref}>
      {dimensions ? (
        <PlethBody
          width={dimensions.width}
          height={dimensions.height}
          layers={layers}
        />
      ) : null}
    </Wrapper>
  );
};

export default Pleth;
