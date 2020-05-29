import React, { useRef } from 'react';
import { Wrapper } from './styles';
import { useResizeObserver } from './useResizeObserver';
import { PlethBody } from './PlethBody';

const Pleth = ({ layers }) => {
  const ref = useRef();
  const dimensions = useResizeObserver(ref);

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
export { PolygonsLayer } from './PolygonsLayer';
export { PolygonLabelsLayer } from './PolygonLabelsLayer';
