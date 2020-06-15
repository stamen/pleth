import React, { Fragment } from 'react';
import polylabel from '@datavis-tech/polylabel';
import { maxIndex } from 'd3-array';

export const PolygonLabelsLayer = ({
  width,
  height,
  geometries,
  projection,
  path,
}) => {
  // Wait for geometries to load.
  if (!geometries) return null;

  // TODO memoize this
  // TODO move all this to preprocessing
  const labels = [];
  geometries.features.forEach((feature) => {
    if (feature.geometry.type === 'Polygon') {
      labels.push({
        id: feature.id,
        name: feature.properties.name,
        coordinates: polylabel(feature.geometry.coordinates),
      });
    } else if (feature.geometry.type === 'MultiPolygon') {
      const polylabels = feature.geometry.coordinates.map((polygon) =>
        polylabel(polygon)
      );
      const coordinates = polylabels[maxIndex(polylabels, (d) => d.distance)];

      if (coordinates === null) {
        console.log(feature.geometry.coordinates);
        return;
      }

      labels.push({
        id: feature.id,
        name: feature.properties.name,
        coordinates,
      });
      //      console.log(polylabels);
      //coordinates: polylabel(feature.geometry.coordinates),
      // TODO make it work for MultiPolygons.
      // Related: https://github.com/mapbox/polylabel/pull/61
      //console.log(feature.geometry.coordinates.map(coordinatespath.area));
      //console.log(feature.geometry.coordinates, arr => arr.length
      //labels.push({
      //  name: feature.properties.name,
      //  coordinates: polylabel(max(feature.geometry.coordinates, path.area))
      //});
    }
  });

  return (
    <svg width={width} height={height}>
      {labels.map(({ id, name, coordinates }) => {
        console.log(coordinates);
        const projectedCoordinates = projection(coordinates);
        if (projectedCoordinates === null) {
          return null;
        }
        console.log(projectedCoordinates);
        console.log(name);
        const [x, y] = projection(coordinates);
        return (
          <Fragment key={id}>
            <circle cx={x} cy={y} r={2} />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              // TODO use styled components
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
                fontSize: '10px',
              }}
            >
              {name}
            </text>
          </Fragment>
        );
      })}
    </svg>
  );
};
