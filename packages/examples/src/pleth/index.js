import React, { useRef, useCallback } from 'react';
import { Wrapper } from './styles';
import { useResizeObserver } from './useResizeObserver';
import { useCache } from './useCache';
import { PlethBody } from './PlethBody';

const Pleth = ({ layers, dataProviders, activeId }) => {
  const ref = useRef();
  const dimensions = useResizeObserver(ref);
  const { get } = useCache();

  const findDataProvider = useCallback(
    (id) =>
      dataProviders.find((dataProvider) => dataProvider.isSupportedId(id)),
    [dataProviders]
  );

  const geometriesForActiveRegion = get({
    cacheKey: 'geometries' + activeId,
    onCacheMiss: () => {
      const dataProvider = findDataProvider(activeId);
      if (!dataProvider) {
        throw new Error(
          'No data provider found that can support id "' + activeId + '".'
        );
      }
      return dataProvider.fetchGeometriesForID(activeId);
    },
  });

  return (
    <Wrapper ref={ref}>
      {dimensions ? (
        <PlethBody
          width={dimensions.width}
          height={dimensions.height}
          layers={layers}
          geometriesForActiveRegion={geometriesForActiveRegion}
        />
      ) : null}
    </Wrapper>
  );
};

export default Pleth;
export { PolygonsLayer } from './PolygonsLayer';
export { PolygonLabelsLayer } from './PolygonLabelsLayer';
