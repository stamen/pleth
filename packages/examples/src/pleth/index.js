import React, { useRef, useCallback } from 'react';
import { useCache } from '@stamen/pleth-cache';
import { geoAlbersUsaTerritories } from 'geo-albers-usa-territories';
import { geoAlbersUsa } from 'd3-geo';
import { Wrapper } from './styles';
import { useResizeObserver } from './useResizeObserver';
import { PlethBody } from './PlethBody';

const Pleth = ({ layers, geometryProviders, activeId, urlDispatch }) => {
  const ref = useRef();
  const dimensions = useResizeObserver(ref);
  const { get } = useCache();

  const findGeometryProvider = useCallback(
    (id) =>
      geometryProviders.find((geometryProvider) =>
        geometryProvider.isSupportedId(id)
      ),
    [geometryProviders]
  );

  // TODO clean this up, make it configurable.
  const projection = (activeId === 'USA'
    ? geoAlbersUsaTerritories()
    : geoAlbersUsa()
  )
    .scale(1300)
    .translate([487.5, 305]);

  // Get the geometries based on the active geo ID.
  const geometries = get({
    cacheKey: 'geometries' + activeId,
    onCacheMiss: () => {
      const geometryProvider = findGeometryProvider(activeId);
      if (!geometryProvider) {
        throw new Error(
          'No data provider found that can support id "' + activeId + '".'
        );
      }
      return geometryProvider.fetchGeometriesForID(activeId);
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
          urlDispatch={urlDispatch}
        />
      ) : null}
    </Wrapper>
  );
};

export default Pleth;
export { PolygonsLayer } from './PolygonsLayer';
export { PolygonLabelsLayer } from './PolygonLabelsLayer';
export { useURLState } from './useURLState';
