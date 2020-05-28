import React, { useRef } from 'react';
import { Wrapper } from './styles';
import { useResizeObserver } from './useResizeObserver';
import { PlethBody } from './PlethBody';
import { PolygonsLayer } from './PolygonsLayer';

const Pleth = () => {
  const ref = useRef();
  const dimensions = useResizeObserver(ref);

  const layers = [PolygonsLayer];

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
