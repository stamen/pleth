import React, { useRef, useCallback } from 'react';
import { geoPath } from 'd3-geo';
import { geoAlbersUsaTerritories } from 'geo-albers-usa-territories';
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

  // TODO make this dynamic per region.
  const projection = geoAlbersUsaTerritories()
    .scale(1300)
    .translate([487.5, 305]);

  const path = geoPath(projection);

  const geometries = get({
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
          geometries={geometries}
          projection={projection}
          path={path}
        />
      ) : null}
    </Wrapper>
  );
};

export default Pleth;
export { PolygonsLayer } from './PolygonsLayer';
export { PolygonLabelsLayer } from './PolygonLabelsLayer';
